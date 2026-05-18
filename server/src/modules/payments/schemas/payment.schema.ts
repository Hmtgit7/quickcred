import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Loan', required: true, index: true })
  loanId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  borrowerId!: Types.ObjectId;

  @Prop({ required: true, trim: true, uppercase: true, unique: true })
  utrNumber!: string;

  @Prop({ required: true, min: 1 })
  amount!: number;

  @Prop({ required: true })
  paymentDate!: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recordedBy!: Types.ObjectId;

  // ── Balance snapshot at time of payment — immutable audit trail ────────
  @Prop({ required: true, default: 0 })
  outstandingBefore!: number;

  @Prop({ required: true, default: 0 })
  outstandingAfter!: number;

  createdAt!: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ loanId: 1, createdAt: 1 });
