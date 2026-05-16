import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, Max } from 'class-validator';
import { LOAN } from '../../../common/constants';

export class ApplyLoanDto {
  @ApiProperty({
    example: 200000,
    description: 'Principal amount in INR (50,000 – 5,00,000)',
    minimum: LOAN.MIN_AMOUNT,
    maximum: LOAN.MAX_AMOUNT,
  })
  @IsNumber({}, { message: 'Principal amount must be a number' })
  @Min(LOAN.MIN_AMOUNT, { message: `Minimum loan amount is ₹${LOAN.MIN_AMOUNT.toLocaleString()}` })
  @Max(LOAN.MAX_AMOUNT, { message: `Maximum loan amount is ₹${LOAN.MAX_AMOUNT.toLocaleString()}` })
  principalAmount!: number;

  @ApiProperty({
    example: 180,
    description: 'Loan tenure in days (30 – 365)',
    minimum: LOAN.MIN_TENURE_DAYS,
    maximum: LOAN.MAX_TENURE_DAYS,
  })
  @IsInt({ message: 'Tenure must be a whole number of days' })
  @Min(LOAN.MIN_TENURE_DAYS, { message: `Minimum tenure is ${LOAN.MIN_TENURE_DAYS} days` })
  @Max(LOAN.MAX_TENURE_DAYS, { message: `Maximum tenure is ${LOAN.MAX_TENURE_DAYS} days` })
  tenureDays!: number;
}
