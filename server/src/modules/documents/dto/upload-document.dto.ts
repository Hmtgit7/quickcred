import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '../schemas/document.schema';

export { DocumentType };

export class UploadDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.SalarySlip,
    description: 'Type of document being uploaded',
  })
  @IsEnum(DocumentType)
  documentType!: DocumentType;

  @ApiPropertyOptional({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'Loan ObjectId to associate this document with (optional at upload time)',
  })
  @IsOptional()
  @IsString()
  loanId?: string;
}
