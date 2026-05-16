import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } }) // immutable — no updatedAt
export class AuditLog {
  @Prop({ required: true, trim: true })
  entityType!: string; // 'loan' | 'payment' | 'user'

  @Prop({ type: Types.ObjectId, required: true, index: true })
  entityId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  action!: string; // 'STATUS_CHANGED' | 'PAYMENT_RECORDED' | 'PROFILE_UPDATED'

  @Prop({ type: String, default: null })
  fromStatus!: string | null;

  @Prop({ type: String, default: null })
  toStatus!: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actorId!: Types.ObjectId;

  @Prop({ type: String, enum: Role, required: true })
  actorRole!: Role;

  @Prop({ type: String, default: null })
  reason!: string | null;

  @Prop({ type: Object, default: null })
  metadata!: Record<string, unknown> | null;

  createdAt!: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ entityId: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
