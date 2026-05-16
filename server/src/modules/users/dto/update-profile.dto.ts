import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsEnum,
  Matches,
  MaxLength,
} from 'class-validator';
import { EmploymentMode } from '../../../common/enums/employment-mode.enum';
import { BRE } from '../../../common/constants';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName!: string;

  @ApiProperty({ example: 'ABCDE1234F', description: 'Indian PAN card number' })
  @IsString()
  @Matches(BRE.PAN_REGEX, { message: 'Invalid PAN format. Expected: ABCDE1234F' })
  pan!: string;

  @ApiProperty({ example: '1990-05-15', description: 'Date of birth (ISO 8601)' })
  @IsDateString({}, { message: 'Date of birth must be a valid ISO date string' })
  dob!: string;

  @ApiProperty({ example: 50000, description: 'Monthly salary in INR' })
  @IsNumber()
  @Min(0)
  monthlySalary!: number;

  @ApiProperty({ enum: EmploymentMode, example: EmploymentMode.Salaried })
  @IsEnum(EmploymentMode)
  employmentMode!: EmploymentMode;
}
