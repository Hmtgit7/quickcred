import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan, LoanDocument } from '../loans/schemas/loan.schema';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoanStatus } from '../../common/enums/loan-status.enum';
import { Role } from '../../common/enums/role.enum';
import {
  OverviewKpis,
  DisbursementChartPoint,
  RepaymentChartPoint,
  LoanStatusBreakdown,
} from './interfaces/analytics-data.interface';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // ── Overview KPIs ────────────────────────────────────────────────────
  async getOverview(): Promise<OverviewKpis> {
    const [statusAgg, bookValueAgg, disbursedValueAgg, totalCollectedAgg, totalBorrowers] =
      await Promise.all([
        // Status counts in one pipeline
        this.loanModel.aggregate<{ _id: string; count: number }>([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        // Total loan book value (all non-rejected)
        this.loanModel.aggregate<{ total: number }>([
          { $match: { status: { $ne: LoanStatus.Rejected } } },
          { $group: { _id: null, total: { $sum: '$principalAmount' } } },
        ]),

        // Disbursed value + expected repayment
        this.loanModel.aggregate<{ totalPrincipal: number; totalRepayment: number }>([
          { $match: { status: { $in: [LoanStatus.Disbursed, LoanStatus.Closed] } } },
          {
            $group: {
              _id: null,
              totalPrincipal: { $sum: '$principalAmount' },
              totalRepayment: { $sum: '$totalRepayment' },
            },
          },
        ]),

        // Total collected payments
        this.paymentModel.aggregate<{ total: number }>([
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),

        // Total borrowers
        this.userModel.countDocuments({ role: Role.Borrower }),
      ]);

    // Map status counts
    const statusMap = new Map<string, number>(statusAgg.map((s) => [s._id, s.count]));

    const totalLoans = Array.from(statusMap.values()).reduce((a, b) => a + b, 0);
    const totalLoanBookValue = bookValueAgg[0]?.total ?? 0;
    const totalDisbursedValue = disbursedValueAgg[0]?.totalPrincipal ?? 0;
    const totalRepaymentExpected = disbursedValueAgg[0]?.totalRepayment ?? 0;
    const totalCollected = totalCollectedAgg[0]?.total ?? 0;
    const repaymentRate =
      totalRepaymentExpected > 0
        ? Math.round((totalCollected / totalRepaymentExpected) * 10000) / 100
        : 0;

    return {
      totalLoans,
      totalBorrowers,
      appliedLoans: statusMap.get(LoanStatus.Applied) ?? 0,
      sanctionedLoans: statusMap.get(LoanStatus.Sanctioned) ?? 0,
      disbursedLoans: statusMap.get(LoanStatus.Disbursed) ?? 0,
      closedLoans: statusMap.get(LoanStatus.Closed) ?? 0,
      rejectedLoans: statusMap.get(LoanStatus.Rejected) ?? 0,
      totalLoanBookValue,
      totalDisbursedValue,
      totalRepaymentExpected,
      totalCollected,
      repaymentRate,
    };
  }

  // ── Disbursement chart — last N days ─────────────────────────────────
  async getDisbursementChart(days = 30): Promise<DisbursementChartPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const result = await this.loanModel.aggregate<{
      _id: { year: number; month: number; day: number };
      count: number;
      totalAmount: number;
    }>([
      {
        $match: {
          status: { $in: [LoanStatus.Disbursed, LoanStatus.Closed] },
          disbursedAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$disbursedAt' },
            month: { $month: '$disbursedAt' },
            day: { $dayOfMonth: '$disbursedAt' },
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$principalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    return result.map((r) => ({
      date: `${r._id.year}-${String(r._id.month).padStart(2, '0')}-${String(r._id.day).padStart(2, '0')}`,
      count: r.count,
      totalAmount: r.totalAmount,
    }));
  }

  // ── Repayment chart — last N months ──────────────────────────────────
  async getRepaymentChart(months = 6): Promise<RepaymentChartPoint[]> {
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    // Payments grouped by month
    const paymentsAgg = await this.paymentModel.aggregate<{
      _id: { year: number; month: number };
      collected: number;
    }>([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          collected: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Expected repayment per month (loans disbursed that month)
    const expectedAgg = await this.loanModel.aggregate<{
      _id: { year: number; month: number };
      expected: number;
    }>([
      {
        $match: {
          status: { $in: [LoanStatus.Disbursed, LoanStatus.Closed] },
          disbursedAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$disbursedAt' },
            month: { $month: '$disbursedAt' },
          },
          expected: { $sum: '$totalRepayment' },
        },
      },
    ]);

    // Merge by month key
    const expectedMap = new Map(
      expectedAgg.map((e) => [`${e._id.year}-${e._id.month}`, e.expected])
    );

    return paymentsAgg.map((p) => {
      const key = `${p._id.year}-${p._id.month}`;
      const expected = expectedMap.get(key) ?? 0;
      const rate = expected > 0 ? Math.round((p.collected / expected) * 10000) / 100 : 0;
      return {
        month: `${p._id.year}-${String(p._id.month).padStart(2, '0')}`,
        collected: p.collected,
        expected,
        rate,
      };
    });
  }

  // ── Loan status breakdown (pie chart data) ───────────────────────────
  async getStatusBreakdown(): Promise<LoanStatusBreakdown[]> {
    const result = await this.loanModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const total = result.reduce((sum, r) => sum + r.count, 0);
    return result.map((r) => ({
      status: r._id,
      count: r.count,
      percentage: total > 0 ? Math.round((r.count / total) * 10000) / 100 : 0,
    }));
  }
}
