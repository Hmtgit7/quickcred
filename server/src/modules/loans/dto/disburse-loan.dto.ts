import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, Length } from 'class-validator';

export class DisburseLoanDto {
  @ApiProperty({
    example: 'UTR123456789012',
    description: 'UTR number for the disbursed funds transfer',
  })
  @IsString()
  @Length(10, 22, { message: 'UTR number must be between 10 and 22 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'UTR number must contain only uppercase letters and digits' })
  disbursalUtrNumber!: string;
}
