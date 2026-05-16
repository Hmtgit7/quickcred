import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';
import { EmploymentMode } from '../../../common/enums/employment-mode.enum';

export type UserDocument = HydratedDocument<User>;
type UserTransformResult = Record<string, unknown> & {
  password?: unknown;
  refreshToken?: unknown;
};

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: UserTransformResult) => {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    },
  },
})
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;

  @Prop({ required: true, select: false }) // never returned in queries by default
  password!: string;

  @Prop({ required: true, enum: Role, default: Role.Borrower })
  role!: Role;

  // ── Borrower profile fields (null for exec/admin accounts) ──────────────
  @Prop({ trim: true })
  fullName?: string;

  @Prop({
    trim: true,
    uppercase: true,
    sparse: true, // allows multiple nulls with unique index
    index: true,
  })
  pan?: string;

  @Prop()
  dob?: Date;

  @Prop({ min: 0 })
  monthlySalary?: number;

  @Prop({ enum: EmploymentMode })
  employmentMode?: EmploymentMode;

  @Prop({ default: false })
  profileCompleted!: boolean;

  // ── Auth fields ─────────────────────────────────────────────────────────
  @Prop({ select: false }) // hashed refresh token — never returned
  refreshToken?: string;

  // Virtuals / timestamps added by Mongoose automatically
  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Compound index — fast lookup for ops dashboard lead queries
UserSchema.index({ role: 1, profileCompleted: 1 });
