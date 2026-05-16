import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentRecord = HydratedDocument<Document>;

export enum DocumentType {
  SalarySlip = 'salary_slip',
  IdProof = 'id_proof',
  AddressProof = 'address_proof',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  uploadedBy!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Loan', default: null })
  loanId!: Types.ObjectId | null;

  @Prop({ type: String, enum: DocumentType, required: true })
  documentType!: DocumentType;

  @Prop({ required: true, trim: true })
  originalName!: string; // original filename from client

  @Prop({ required: true })
  cloudinaryUrl!: string; // secure HTTPS URL

  @Prop({ required: true })
  cloudinaryPublicId!: string; // for deletion

  @Prop({ required: true })
  mimeType!: string; // 'image/jpeg' | 'image/png' | 'application/pdf'

  @Prop({ required: true })
  sizeBytes!: number;

  createdAt!: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

DocumentSchema.index({ uploadedBy: 1, documentType: 1 });
DocumentSchema.index({ loanId: 1 });
