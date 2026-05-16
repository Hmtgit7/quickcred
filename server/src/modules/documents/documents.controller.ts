import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { FILE_UPLOAD } from '../../common/constants';

@ApiTags('documents')
@ApiBearerAuth('access-token')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // ── Upload a document ───────────────────────────────────────────────────
  @Post('upload')
  @Roles(Role.Borrower, Role.Admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // keep in buffer — we stream to Cloudinary
      limits: { fileSize: FILE_UPLOAD.MAX_SIZE_BYTES },
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'documentType'],
      properties: {
        file: { type: 'string', format: 'binary' },
        documentType: {
          type: 'string',
          enum: ['salary_slip', 'id_proof', 'address_proof'],
        },
        loanId: { type: 'string', description: 'Optional loan ObjectId' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a document (PDF/JPG/PNG, max 5MB)' })
  @ApiCreatedResponse({ description: 'Document uploaded and stored' })
  uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE_UPLOAD.MAX_SIZE_BYTES }),
          new FileTypeValidator({ fileType: /^(application\/pdf|image\/jpeg|image\/png)$/ }),
        ],
      })
    )
    file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.documentsService.uploadDocument(file, dto, user);
  }

  // ── Get documents for a loan ────────────────────────────────────────────
  @Get('loan/:loanId')
  @Roles(Role.Borrower, Role.Admin, Role.Sanction, Role.Disbursement, Role.Collection)
  @ApiOperation({ summary: 'Get all documents attached to a loan' })
  @ApiOkResponse({ description: 'List of loan documents' })
  @ApiParam({ name: 'loanId', description: 'Loan ObjectId' })
  getLoanDocuments(
    @Param('loanId', ParseObjectIdPipe) loanId: Types.ObjectId,
    @CurrentUser() user: JwtPayload
  ) {
    return this.documentsService.getLoanDocuments(loanId, user);
  }

  // ── Get own documents (borrower) ────────────────────────────────────────
  @Get('my')
  @Roles(Role.Borrower)
  @ApiOperation({ summary: 'Get all documents uploaded by current borrower' })
  @ApiOkResponse({ description: 'List of own documents' })
  getMyDocuments(@CurrentUser() user: JwtPayload) {
    return this.documentsService.getMyDocuments(user);
  }

  // ── Delete a document ────────────────────────────────────────────────────
  @Delete(':id')
  @Roles(Role.Borrower, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a document (own documents or Admin)' })
  @ApiParam({ name: 'id', description: 'Document ObjectId' })
  deleteDocument(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser() user: JwtPayload
  ) {
    return this.documentsService.deleteDocument(id, user);
  }
}
