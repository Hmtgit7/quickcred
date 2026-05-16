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

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);

  constructor(
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationsService: NotificationsService
  ) {}

  // ── Apply for a loan ────────────────────────────────────────────────────
  async applyLoan(dto: ApplyLoanDto, currentUser: JwtPayload): Promise<LoanDocument> {
    // Borrower must have completed profile before applying
    const user = await this.userModel.findById(currentUser.sub);
    if (!user) throw new NotFoundException('User not found');
    if (!user.profileCompleted) {
      throw new BadRequestException(
        'Please complete your profile and pass eligibility checks before applying'
      );
    }

    // Only one active loan per borrower (no duplicate open applications)
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

  // ── Borrower: get own loans ─────────────────────────────────────────────
  async getMyLoans(currentUser: JwtPayload): Promise<LoanDocument[]> {
    return this.loanModel
      .find({ borrowerId: new Types.ObjectId(currentUser.sub) })
      .sort({ createdAt: -1 })
      .populate('sanctionedBy', 'fullName email')
      .populate('disbursedBy', 'fullName email')
      .lean();
  }

  // ── Ops dashboard: get all loans (paginated, filtered) ──────────────────
  async getAll(query: LoanQueryDto): Promise<PaginatedResponse<LoanDocument>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) filter['status'] = query.status;

    // If search is provided, join with users collection
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

  // ── Get single loan ─────────────────────────────────────────────────────
  async getById(loanId: Types.ObjectId, currentUser: JwtPayload): Promise<LoanDocument> {
    const loan = await this.loanModel
      .findById(loanId)
      .populate('borrowerId', 'fullName email pan monthlySalary employmentMode')
      .populate('sanctionedBy', 'fullName email')
      .populate('disbursedBy', 'fullName email')
      .lean();

    if (!loan) throw new NotFoundException('Loan not found');

    // Borrowers can only see their own loans
    if (currentUser.role === Role.Borrower && loan.borrowerId.toString() !== currentUser.sub) {
      throw new ForbiddenException('You can only view your own loans');
    }

    return loan;
  }

  // ── Sanction: approve or reject ─────────────────────────────────────────
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

  // ── Disbursement: mark as disbursed ─────────────────────────────────────
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

  // ── Get audit trail for a loan ───────────────────────────────────────────
  async getAuditTrail(loanId: Types.ObjectId): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ entityType: 'loan', entityId: loanId })
      .populate('actorId', 'fullName email role')
      .sort({ createdAt: 1 })
      .lean();
  }

  // ── Internal: auto-close (called by PaymentsService) ────────────────────
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

  // ── Utility: SI calculation ──────────────────────────────────────────────
  calculateLoan(principal: number, tenureDays: number, rate: number): LoanCalculation {
    // SI = (P × R × T) / (365 × 100)
    const simpleInterest = Math.round((principal * rate * tenureDays) / (365 * 100));
    return {
      principalAmount: principal,
      tenureDays,
      interestRate: rate,
      simpleInterest,
      totalRepayment: principal + simpleInterest,
    };
  }

  // ── Private: write audit log ─────────────────────────────────────────────
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
      // Audit failure must NEVER crash a business operation
      this.logger.warn('Audit log write failed', err);
    }
  }
}
