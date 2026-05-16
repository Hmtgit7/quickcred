import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, Length, Matches, Min, Max } from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty({ example: '64f1a2b3c4d5e6f7a8b9c0d1', description: 'MongoDB ObjectId of the loan' })
  @IsString()
  loanId!: string;

  @ApiProperty({
    example: 'UTR123456789012',
    description: 'Unique Transaction Reference — must be globally unique',
  })
  @IsString()
  @Length(10, 22, { message: 'UTR number must be between 10 and 22 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'UTR must contain only uppercase letters and digits' })
  utrNumber!: string;

  @ApiProperty({ example: 15000, description: 'Payment amount in INR (minimum ₹1)' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(1, { message: 'Payment amount must be at least ₹1' })
  @Max(500_000, { message: 'Payment amount cannot exceed ₹5,00,000' })
  amount!: number;

  @ApiProperty({
    example: '2026-05-16',
    description: 'Date of payment (ISO 8601 date string)',
  })
  @IsDateString({}, { message: 'paymentDate must be a valid ISO date string (e.g. 2026-05-16)' })
  paymentDate!: string;
}
