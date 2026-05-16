import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import { PAGINATION } from '../../common/constants';

export interface NotificationPage {
  notifications: NotificationDocument[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>
  ) {}

  // ── Internal: create a notification (called by LoansService / PaymentsService) ──
  async create(dto: CreateNotificationDto): Promise<void> {
    try {
      await this.notificationModel.create({
        recipientId: new Types.ObjectId(dto.recipientId),
        type: dto.type,
        title: dto.title,
        message: dto.message,
        loanId: dto.loanId ?? null,
        isRead: false,
      });
    } catch (err) {
      // Notification failure must never crash business operations
      this.logger.warn('Failed to create notification', err);
    }
  }

  // ── Convenience factory methods — called from LoansService / PaymentsService ──

  async notifyLoanApplied(borrowerId: string, loanId: Types.ObjectId): Promise<void> {
    await this.create({
      recipientId: borrowerId,
      type: NotificationType.LoanApplied,
      title: 'Loan Application Submitted',
      message: 'Your loan application has been submitted and is under review.',
      loanId,
    });
  }

  async notifyLoanSanctioned(borrowerId: string, loanId: Types.ObjectId): Promise<void> {
    await this.create({
      recipientId: borrowerId,
      type: NotificationType.LoanSanctioned,
      title: '🎉 Loan Approved!',
      message:
        'Congratulations! Your loan has been approved by the sanction team and will be disbursed shortly.',
      loanId,
    });
  }

  async notifyLoanRejected(
    borrowerId: string,
    loanId: Types.ObjectId,
    reason: string
  ): Promise<void> {
    await this.create({
      recipientId: borrowerId,
      type: NotificationType.LoanRejected,
      title: 'Loan Application Rejected',
      message: `Your loan application was not approved. Reason: ${reason}`,
      loanId,
    });
  }

  async notifyLoanDisbursed(
    borrowerId: string,
    loanId: Types.ObjectId,
    amount: number
  ): Promise<void> {
    await this.create({
      recipientId: borrowerId,
      type: NotificationType.LoanDisbursed,
      title: '💰 Funds Disbursed',
      message: `₹${amount.toLocaleString('en-IN')} has been disbursed to your account. Repayment schedule is now active.`,
      loanId,
    });
  }

  async notifyPaymentRecorded(
    borrowerId: string,
    loanId: Types.ObjectId,
    amount: number,
    outstanding: number
  ): Promise<void> {
    const isFullyPaid = outstanding <= 0;
    await this.create({
      recipientId: borrowerId,
      type: isFullyPaid ? NotificationType.LoanClosed : NotificationType.PaymentRecorded,
      title: isFullyPaid ? '✅ Loan Fully Repaid!' : 'Payment Recorded',
      message: isFullyPaid
        ? `Your payment of ₹${amount.toLocaleString('en-IN')} has been received. Your loan is now fully repaid and closed. Thank you!`
        : `Payment of ₹${amount.toLocaleString('en-IN')} received. Outstanding balance: ₹${outstanding.toLocaleString('en-IN')}.`,
      loanId,
    });
  }

  // ── Get paginated notifications for current user ──────────────────────
  async getMyNotifications(
    currentUser: JwtPayload,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ): Promise<NotificationPage> {
    const skip = (page - 1) * limit;

    const recipientId = new Types.ObjectId(currentUser.sub);

    const [notifications, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find({ recipientId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.notificationModel.countDocuments({ recipientId }),
      this.notificationModel.countDocuments({ recipientId, isRead: false }),
    ]);

    return {
      notifications: notifications as unknown as NotificationDocument[],
      unreadCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ── Mark single notification as read ─────────────────────────────────
  async markAsRead(
    notificationId: Types.ObjectId,
    currentUser: JwtPayload
  ): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) throw new NotFoundException('Notification not found');

    // Users can only mark their own notifications
    if (notification.recipientId.toString() !== currentUser.sub) {
      throw new ForbiddenException('You can only mark your own notifications as read');
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  // ── Mark ALL unread as read ───────────────────────────────────────────
  async markAllAsRead(currentUser: JwtPayload): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { recipientId: new Types.ObjectId(currentUser.sub), isRead: false },
      { $set: { isRead: true } }
    );
    return { modifiedCount: result.modifiedCount };
  }

  // ── Admin: get all notifications (paginated) ──────────────────────────
  async getAll(
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ): Promise<PaginatedResponse<NotificationDocument>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.notificationModel
        .find()
        .populate('recipientId', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.notificationModel.countDocuments(),
    ]);

    return {
      data: data as unknown as NotificationDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ── Unread count only (for bell badge) ───────────────────────────────
  async getUnreadCount(currentUser: JwtPayload): Promise<{ count: number }> {
    const count = await this.notificationModel.countDocuments({
      recipientId: new Types.ObjectId(currentUser.sub),
      isRead: false,
    });
    return { count };
  }
}
