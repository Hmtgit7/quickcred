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

  // ── Record a payment ────────────────────────────────────────────────────
  async recordPayment(
    dto: RecordPaymentDto,
    currentUser: JwtPayload
  ): Promise<{ payment: PaymentDocument; autoClosedLoan: boolean }> {
    // 1. Validate loan exists and is in DISBURSED status
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

    // 2. Get current payment summary to validate amount
    const summary = await this.getPaymentSummary(loanObjectId);

    if (summary.outstanding <= 0) {
      throw new BadRequestException('This loan has already been fully repaid');
    }

    if (dto.amount > summary.outstanding) {
      throw new BadRequestException(
        `Payment amount ₹${dto.amount.toLocaleString()} exceeds outstanding balance ₹${summary.outstanding.toLocaleString()}. ` +
          `Maximum allowed: ₹${summary.outstanding.toLocaleString()}`
      );
    }

    // 3. Check UTR uniqueness at application level (DB index is the real guard)
    const existingUtr = await this.paymentModel.findOne({
      utrNumber: dto.utrNumber.toUpperCase(),
    });
    if (existingUtr) {
      throw new ConflictException(
        `UTR number "${dto.utrNumber}" has already been used for another payment`
      );
    }

    // 4. Create payment record
    const payment = await this.paymentModel.create({
      loanId: loanObjectId,
      borrowerId: loan.borrowerId,
      utrNumber: dto.utrNumber.toUpperCase(),
      amount: dto.amount,
      paymentDate: new Date(dto.paymentDate),
      recordedBy: new Types.ObjectId(currentUser.sub),
    });

    this.logger.log(
      `Payment ₹${dto.amount} recorded for loan ${dto.loanId} by ${currentUser.email} (UTR: ${dto.utrNumber})`
    );

    // 5. Auto-close check — recalculate after this payment
    const newTotalPaid = summary.totalPaid + dto.amount;
    const autoClosedLoan = newTotalPaid >= loan.totalRepayment;

    if (autoClosedLoan) {
      await this.loansService.autoClose(loanObjectId, currentUser.sub);
      this.logger.log(`Loan ${dto.loanId} auto-closed — full repayment received`);
    }

    const newOutstanding = autoClosedLoan ? 0 : summary.outstanding - dto.amount;
    await this.notificationsService.notifyPaymentRecorded(
      loan.borrowerId.toString(),
      loanObjectId,
      dto.amount,
      newOutstanding
    );

    return { payment, autoClosedLoan };
  }

  // ── Get all payments for a loan ─────────────────────────────────────────
  async getLoanPayments(loanId: Types.ObjectId): Promise<PaymentDocument[]> {
    const loan = await this.loanModel.findById(loanId).lean();
    if (!loan) throw new NotFoundException('Loan not found');

    return this.paymentModel
      .find({ loanId })
      .populate('recordedBy', 'fullName email role')
      .sort({ paymentDate: 1 })
      .lean();
  }

  // ── Payment summary for a loan ──────────────────────────────────────────
  async getPaymentSummary(loanId: Types.ObjectId): Promise<PaymentSummary> {
    const loan = await this.loanModel.findById(loanId).lean();
    if (!loan) throw new NotFoundException('Loan not found');

    // Aggregate total paid using MongoDB pipeline — single DB round-trip
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
