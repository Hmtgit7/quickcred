import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ApplyLoanDto } from './dto/apply-loan.dto';
import { SanctionLoanDto, SanctionAction } from './dto/sanction-loan.dto';
import { DisburseLoanDto } from './dto/disburse-loan.dto';
import { LoanQueryDto } from './dto/loan-query.dto';
import { LoanCalculation } from './interfaces/loan-calculation.interface';
import { LoanStatus } from '../../common/enums/loan-status.enum';
import { Role } from '../../common/enums/role.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import { LOAN } from '../../common/constants';
import { Loan, LoanDocument } from './schemas/loan.schema';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';

interface PaymentAggResult {
  _id: Types.ObjectId;
  totalPaid: number;
}

type LeanLoan = Loan & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };
type LoanWithOutstanding = LeanLoan & { outstandingAmount: number };

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);

  constructor(
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly notificationsService: NotificationsService
  ) {}

  async applyLoan(dto: ApplyLoanDto, currentUser: JwtPayload): Promise<LoanDocument> {
    const user = await this.userModel.findById(currentUser.sub);
    if (!user) throw new NotFoundException('User not found');
    if (!user.profileCompleted) {
      throw new BadRequestException(
        'Please complete your profile and pass eligibility checks before applying'
      );
    }

    const activeLoan = await this.loanModel.findOne({
      borrowerId: new Types.ObjectId(currentUser.sub),
      status: { $in: [LoanStatus.Applied, LoanStatus.Sanctioned, LoanStatus.Disbursed] },
    });
    if (activeLoan) {
      throw new BadRequestException('You already have an active loan in progress');
    }

    const calculation = this.calculateLoan(dto.principalAmount, dto.tenureDays, LOAN.INTEREST_RATE);

    const loan = await this.loanModel.create({
      borrowerId: new Types.ObjectId(currentUser.sub),
      status: LoanStatus.Applied,
      ...calculation,
    });

    await this.writeAuditLog({
      entityType: 'loan',
      entityId: loan._id,
      action: 'LOAN_APPLIED',
      fromStatus: null,
      toStatus: LoanStatus.Applied,
      actorId: new Types.ObjectId(currentUser.sub),
      actorRole: currentUser.role,
    });

    await this.notificationsService.notifyLoanApplied(currentUser.sub, loan._id);

    this.logger.log(`Loan ${loan._id.toString()} applied by borrower ${currentUser.sub}`);
    return loan;
  }

  async getMyLoans(currentUser: JwtPayload): Promise<LoanWithOutstanding[]> {
    // Pass Loan class as generic so TypeScript knows the field shapes after lean()
    const loans = await this.loanModel
      .find({ borrowerId: new Types.ObjectId(currentUser.sub) })
      .sort({ createdAt: -1 })
      .populate('sanctionedBy', 'fullName email')
      .populate('disbursedBy', 'fullName email')
      .lean<LeanLoan[]>();

    if (!loans.length) return [];

    const loanIds = loans.map((l) => l._id);

    const paymentsAgg = await this.paymentModel.aggregate<PaymentAggResult>([
      { $match: { loanId: { $in: loanIds } } },
      { $group: { _id: '$loanId', totalPaid: { $sum: '$amount' } } },
    ]);

    const paidMap = new Map<string, number>(
      paymentsAgg.map((p) => [p._id.toString(), p.totalPaid])
    );

    return loans.map((loan) => ({
      ...loan,
      outstandingAmount: Math.max(0, loan.totalRepayment - (paidMap.get(loan._id.toString()) ?? 0)),
    }));
  }

  async getAll(query: LoanQueryDto): Promise<PaginatedResponse<LoanDocument>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) filter['status'] = query.status;

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      const matchingUsers = await this.userModel
        .find({ $or: [{ fullName: searchRegex }, { email: searchRegex }] })
        .select('_id')
        .lean();
      filter['borrowerId'] = { $in: matchingUsers.map((u) => u._id) };
    }

    const [data, total] = await Promise.all([
      this.loanModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('borrowerId', 'fullName email pan monthlySalary employmentMode')
        .populate('sanctionedBy', 'fullName email')
        .populate('disbursedBy', 'fullName email')
        .lean(),
      this.loanModel.countDocuments(filter),
    ]);

    return {
      data: data as unknown as LoanDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(loanId: Types.ObjectId, currentUser: JwtPayload): Promise<LoanDocument> {
    const loan = await this.loanModel
      .findById(loanId)
      .populate('borrowerId', 'fullName email pan monthlySalary employmentMode')
      .populate('sanctionedBy', 'fullName email')
      .populate('disbursedBy', 'fullName email')
      .lean();

    if (!loan) throw new NotFoundException('Loan not found');

    const rawBorrowerId = loan.borrowerId as unknown;
    const borrowerId =
      typeof rawBorrowerId === 'object' && rawBorrowerId !== null && '_id' in rawBorrowerId
        ? (rawBorrowerId as { _id: Types.ObjectId })._id.toString()
        : String(rawBorrowerId);

    if (currentUser.role === Role.Borrower && borrowerId !== currentUser.sub) {
      throw new ForbiddenException('You can only view your own loans');
    }

    return loan;
  }

  async sanctionLoan(
    loanId: Types.ObjectId,
    dto: SanctionLoanDto,
    currentUser: JwtPayload
  ): Promise<LoanDocument> {
    const loan = await this.loanModel.findById(loanId);
    if (!loan) throw new NotFoundException('Loan not found');

    if (loan.status !== LoanStatus.Applied) {
      throw new BadRequestException(
        `Loan cannot be sanctioned from status "${loan.status}". Expected "applied".`
      );
    }

    const newStatus =
      dto.action === SanctionAction.Approve ? LoanStatus.Sanctioned : LoanStatus.Rejected;

    const update: Partial<Loan> = {
      status: newStatus,
      sanctionedBy: new Types.ObjectId(currentUser.sub),
      sanctionedAt: new Date(),
    };

    if (dto.action === SanctionAction.Reject) {
      update.rejectionReason = dto.rejectionReason ?? 'Rejected by sanction team';
    }

    const updated = await this.loanModel.findByIdAndUpdate(loanId, update, { new: true });
    if (!updated) throw new NotFoundException('Loan not found after update');

    await this.writeAuditLog({
      entityType: 'loan',
      entityId: loanId,
      action: 'STATUS_CHANGED',
      fromStatus: LoanStatus.Applied,
      toStatus: newStatus,
      actorId: new Types.ObjectId(currentUser.sub),
      actorRole: currentUser.role,
      reason: dto.rejectionReason,
    });

    if (dto.action === SanctionAction.Approve) {
      await this.notificationsService.notifyLoanSanctioned(loan.borrowerId.toString(), loanId);
    } else {
      await this.notificationsService.notifyLoanRejected(
        loan.borrowerId.toString(),
        loanId,
        dto.rejectionReason ?? 'Rejected by sanction team'
      );
    }

    this.logger.log(`Loan ${loanId.toString()} ${newStatus} by ${currentUser.email}`);
    return updated;
  }

  async disburseLoan(
    loanId: Types.ObjectId,
    dto: DisburseLoanDto,
    currentUser: JwtPayload
  ): Promise<LoanDocument> {
    const loan = await this.loanModel.findById(loanId);
    if (!loan) throw new NotFoundException('Loan not found');

    if (loan.status !== LoanStatus.Sanctioned) {
      throw new BadRequestException(
        `Loan cannot be disbursed from status "${loan.status}". Expected "sanctioned".`
      );
    }

    const updated = await this.loanModel.findByIdAndUpdate(
      loanId,
      {
        status: LoanStatus.Disbursed,
        disbursedBy: new Types.ObjectId(currentUser.sub),
        disbursedAt: new Date(),
        disbursalUtrNumber: dto.disbursalUtrNumber,
      },
      { new: true }
    );
    if (!updated) throw new NotFoundException('Loan not found after update');

    await this.writeAuditLog({
      entityType: 'loan',
      entityId: loanId,
      action: 'STATUS_CHANGED',
      fromStatus: LoanStatus.Sanctioned,
      toStatus: LoanStatus.Disbursed,
      actorId: new Types.ObjectId(currentUser.sub),
      actorRole: currentUser.role,
      metadata: { disbursalUtrNumber: dto.disbursalUtrNumber },
    });

    await this.notificationsService.notifyLoanDisbursed(
      loan.borrowerId.toString(),
      loanId,
      loan.principalAmount
    );

    this.logger.log(`Loan ${loanId.toString()} disbursed by ${currentUser.email}`);
    return updated;
  }

  async getAuditTrail(loanId: Types.ObjectId): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ entityType: 'loan', entityId: loanId })
      .populate('actorId', 'fullName email role')
      .sort({ createdAt: 1 })
      .lean();
  }

  async autoClose(loanId: Types.ObjectId, actorId: string): Promise<void> {
    await this.loanModel.findByIdAndUpdate(loanId, {
      status: LoanStatus.Closed,
      closedAt: new Date(),
    });

    await this.writeAuditLog({
      entityType: 'loan',
      entityId: loanId,
      action: 'STATUS_CHANGED',
      fromStatus: LoanStatus.Disbursed,
      toStatus: LoanStatus.Closed,
      actorId: new Types.ObjectId(actorId),
      actorRole: Role.Collection,
      reason: 'Full repayment received — auto-closed',
    });

    this.logger.log(`Loan ${loanId.toString()} auto-closed after full repayment`);
  }

  calculateLoan(principal: number, tenureDays: number, rate: number): LoanCalculation {
    const simpleInterest = Math.round((principal * rate * tenureDays) / (365 * 100));
    return {
      principalAmount: principal,
      tenureDays,
      interestRate: rate,
      simpleInterest,
      totalRepayment: principal + simpleInterest,
    };
  }

  private async writeAuditLog(entry: {
    entityType: string;
    entityId: Types.ObjectId;
    action: string;
    fromStatus: string | null;
    toStatus: string | null;
    actorId: Types.ObjectId;
    actorRole: Role;
    reason?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await this.auditLogModel.create({
        ...entry,
        reason: entry.reason ?? null,
        metadata: entry.metadata ?? null,
      });
    } catch (err) {
      this.logger.warn('Audit log write failed', err);
    }
  }
}
