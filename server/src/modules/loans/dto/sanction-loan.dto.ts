import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, ValidateIf } from 'class-validator';

export enum SanctionAction {
  Approve = 'approve',
  Reject = 'reject',
}

export class SanctionLoanDto {
  @ApiProperty({
    enum: SanctionAction,
    description: 'approve or reject the loan application',
  })
  @IsEnum(SanctionAction, { message: 'Action must be either "approve" or "reject"' })
  action!: SanctionAction;

  @ApiPropertyOptional({
    example: 'Insufficient documentation provided',
    description: 'Required when action is "reject"',
  })
  @ValidateIf((o: SanctionLoanDto) => o.action === SanctionAction.Reject)
  @IsString()
  @MaxLength(500)
  rejectionReason?: string;
}
