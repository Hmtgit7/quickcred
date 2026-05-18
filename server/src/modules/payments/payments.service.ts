import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { PaymentSummary } from './interfaces/payment-summary.interface';
import { LoanStatus } from '../../common/enums/loan-status.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { LoansService } from '../loans/loans.service';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Loan, LoanDocument } from '../loans/schemas/loan.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    private readonly loansService: LoansService,
    private readonly notificationsService: NotificationsService
  ) {}

  async recordPayment(
    dto: RecordPaymentDto,
    currentUser: JwtPayload
  ): Promise<{ payment: PaymentDocument; autoClosedLoan: boolean }> {
    if (!Types.ObjectId.isValid(dto.loanId)) {
      throw new BadRequestException('Invalid loan ID format');
    }
    const loanObjectId = new Types.ObjectId(dto.loanId);

    const loan = await this.loanModel.findById(loanObjectId);
    if (!loan) throw new NotFoundException('Loan not found');

    if (loan.status !== LoanStatus.Disbursed) {
      throw new BadRequestException(
        `Payments can only be recorded for disbursed loans. Current status: "${loan.status}"`
      );
    }

    const summary = await this.getPaymentSummary(loanObjectId);

    if (summary.outstanding <= 0) {
      throw new BadRequestException('This loan has already been fully repaid');
    }

    if (dto.amount > summary.outstanding) {
      throw new BadRequestException(
        `Payment amount ₹${dto.amount.toLocaleString()} exceeds outstanding balance ₹${summary.outstanding.toLocaleString()}.`
      );
    }

    // Check UTR uniqueness at application level (DB unique index is the real guard)
    const existingUtr = await this.paymentModel.findOne({
      utrNumber: dto.utrNumber.toUpperCase(),
    });
    if (existingUtr) {
      throw new ConflictException(
        `UTR number "${dto.utrNumber}" has already been used for another payment`
      );
    }

    const outstandingBefore = summary.outstanding;
    const outstandingAfter = Math.max(0, outstandingBefore - dto.amount);

    // Create the payment with balance snapshot
    const payment = await this.paymentModel.create({
      loanId: loanObjectId,
      borrowerId: loan.borrowerId,
      utrNumber: dto.utrNumber.toUpperCase(),
      amount: dto.amount,
      paymentDate: new Date(dto.paymentDate),
      recordedBy: new Types.ObjectId(currentUser.sub),
      outstandingBefore,
      outstandingAfter,
    });

    // FIX: Update loan.totalPaid so it stays in sync for any direct reads
    await this.loanModel.findByIdAndUpdate(loanObjectId, {
      $inc: { totalPaid: dto.amount },
    });

    this.logger.log(
      `Payment ₹${dto.amount} recorded for loan ${dto.loanId} by ${currentUser.email} (UTR: ${dto.utrNumber})`
    );

    const newTotalPaid = summary.totalPaid + dto.amount;
    const autoClosedLoan = newTotalPaid >= loan.totalRepayment;

    if (autoClosedLoan) {
      await this.loansService.autoClose(loanObjectId, currentUser.sub);
      this.logger.log(`Loan ${dto.loanId} auto-closed — full repayment received`);
    }

    await this.notificationsService.notifyPaymentRecorded(
      loan.borrowerId.toString(),
      loanObjectId,
      dto.amount,
      outstandingAfter
    );

    return { payment, autoClosedLoan };
  }

  async getLoanPayments(loanId: Types.ObjectId): Promise<PaymentDocument[]> {
    const loan = await this.loanModel.findById(loanId).lean();
    if (!loan) throw new NotFoundException('Loan not found');

    return this.paymentModel
      .find({ loanId })
      .populate('recordedBy', 'fullName email role')
      .sort({ paymentDate: 1 })
      .lean();
  }

  async getPaymentSummary(loanId: Types.ObjectId): Promise<PaymentSummary> {
    const loan = await this.loanModel.findById(loanId).lean();
    if (!loan) throw new NotFoundException('Loan not found');

    const [result] = await this.paymentModel.aggregate<{
      totalPaid: number;
      paymentCount: number;
    }>([
      { $match: { loanId } },
      {
        $group: {
          _id: '$loanId',
          totalPaid: { $sum: '$amount' },
          paymentCount: { $sum: 1 },
        },
      },
    ]);

    const totalPaid = result?.totalPaid ?? 0;
    const paymentCount = result?.paymentCount ?? 0;
    const outstanding = Math.max(0, loan.totalRepayment - totalPaid);

    return {
      loanId: loanId.toString(),
      totalRepayment: loan.totalRepayment,
      totalPaid,
      outstanding,
      isFullyPaid: outstanding === 0,
      paymentCount,
    };
  }
}
