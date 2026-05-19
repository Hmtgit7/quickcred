import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LoanStatus } from '../../../common/enums/loan-status.enum';

export type LoanDocument = HydratedDocument<Loan>;

@Schema({ timestamps: true })
export class Loan {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  borrowerId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: LoanStatus,
    default: LoanStatus.Applied,
    index: true,
  })
  status!: LoanStatus;

  @Prop({ required: true, min: 50_000, max: 500_000 })
  principalAmount!: number;

  @Prop({ required: true, min: 30, max: 365 })
  tenureDays!: number;

  @Prop({ required: true, default: 12 })
  interestRate!: number;

  @Prop({ required: true })
  simpleInterest!: number;

  @Prop({ required: true })
  totalRepayment!: number;

  @Prop({ type: Types.ObjectId, ref: 'Document', default: null })
  salarySlipDocId!: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  sanctionedBy!: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  sanctionedAt!: Date | null;

  @Prop({ type: String, default: null, trim: true })
  rejectionReason!: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  disbursedBy!: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  disbursedAt!: Date | null;

  @Prop({ type: String, default: null, trim: true })
  disbursalUtrNumber!: string | null;

  @Prop({ type: Date, default: null })
  closedAt!: Date | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);

LoanSchema.index({ borrowerId: 1, status: 1 });
LoanSchema.index({ status: 1, createdAt: -1 });
