import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } }) // payments are immutable
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Loan', required: true, index: true })
  loanId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  borrowerId!: Types.ObjectId;

  @Prop({ required: true, trim: true, uppercase: true, unique: true })
  utrNumber!: string; // DB-level unique index — deduplication at source

  @Prop({ required: true, min: 1 })
  amount!: number;

  @Prop({ required: true })
  paymentDate!: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recordedBy!: Types.ObjectId; // collection exec or admin

  createdAt!: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Compound index for fast per-loan payment queries
PaymentSchema.index({ loanId: 1, createdAt: 1 });
