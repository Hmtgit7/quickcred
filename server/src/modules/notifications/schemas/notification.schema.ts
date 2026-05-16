import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  LoanApplied = 'loan_applied',
  LoanSanctioned = 'loan_sanctioned',
  LoanRejected = 'loan_rejected',
  LoanDisbursed = 'loan_disbursed',
  LoanClosed = 'loan_closed',
  PaymentRecorded = 'payment_recorded',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipientId!: Types.ObjectId; // always the borrower for loan events

  @Prop({ type: String, enum: NotificationType, required: true })
  type!: NotificationType;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  @Prop({ type: Types.ObjectId, ref: 'Loan', default: null })
  loanId!: Types.ObjectId | null; // quick navigation link

  @Prop({ default: false, index: true })
  isRead!: boolean;

  createdAt!: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Fetch unread count fast
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
