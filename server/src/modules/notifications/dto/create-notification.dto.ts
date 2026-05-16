import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { NotificationType } from '../schemas/notification.schema';

// Internal DTO — used by other services, not exposed via HTTP body
export class CreateNotificationDto {
  @IsMongoId()
  recipientId!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  @MaxLength(100)
  title!: string;

  @IsString()
  @MaxLength(500)
  message!: string;

  @IsOptional()
  loanId?: Types.ObjectId | null;
}
