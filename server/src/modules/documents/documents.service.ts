// server/src/modules/documents/documents.service.ts

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Document as DocumentModel, DocumentRecord, DocumentType } from './schemas/document.schema';
import { CloudinaryService } from '../../libs/cloudinary/cloudinary.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { Role } from '../../common/enums/role.enum';
import { FILE_UPLOAD } from '../../common/constants';
import { Loan, LoanDocument } from '../loans/schemas/loan.schema';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectModel(DocumentModel.name) private documentModel: Model<DocumentRecord>,
    @InjectModel(Loan.name) private loanModel: Model<LoanDocument>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // ── Upload a document ───────────────────────────────────────────────────
  async uploadDocument(
    file: Express.Multer.File,
    dto: UploadDocumentDto,
    currentUser: JwtPayload
  ): Promise<DocumentRecord> {
    // Validate mime type (Multer handles size, we handle type here)
    const allowedMimeTypes = FILE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type "${file.mimetype}". Allowed: PDF, JPG, PNG`);
    }

    // Validate loanId if provided
    let loanObjectId: Types.ObjectId | null = null;
    if (dto.loanId) {
      if (!Types.ObjectId.isValid(dto.loanId)) {
        throw new BadRequestException('Invalid loan ID format');
      }
      loanObjectId = new Types.ObjectId(dto.loanId);
      const loan = await this.loanModel.findById(loanObjectId).lean();
      if (!loan) throw new NotFoundException('Loan not found');

      // Borrowers can only attach documents to their own loans
      if (currentUser.role === Role.Borrower && loan.borrowerId.toString() !== currentUser.sub) {
        throw new ForbiddenException('You can only attach documents to your own loans');
      }
    }

    // Determine Cloudinary resource type: PDFs are 'raw', images are 'image'
    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

    // Upload to Cloudinary
    const uploaded = await this.cloudinaryService.uploadBuffer(
      file.buffer,
      'documents',
      resourceType
    );

    // Create document record in DB
    const document = await this.documentModel.create({
      uploadedBy: new Types.ObjectId(currentUser.sub),
      loanId: loanObjectId,
      documentType: dto.documentType,
      originalName: file.originalname,
      cloudinaryUrl: uploaded.secureUrl,
      cloudinaryPublicId: uploaded.publicId,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    });

    // Auto-link salary slip to loan on the loan record itself
    if (loanObjectId && dto.documentType === DocumentType.SalarySlip) {
      await this.loanModel.findByIdAndUpdate(loanObjectId, {
        salarySlipDocId: document._id,
      });
    }

    this.logger.log(
      `Document ${document._id.toString()} (${dto.documentType}) uploaded by ${currentUser.email}`
    );
    return document;
  }

  // ── Get documents for a loan ────────────────────────────────────────────
  async getLoanDocuments(
    loanId: Types.ObjectId,
    currentUser: JwtPayload
  ): Promise<DocumentRecord[]> {
    const loan = await this.loanModel.findById(loanId).lean();
    if (!loan) throw new NotFoundException('Loan not found');

    if (currentUser.role === Role.Borrower && loan.borrowerId.toString() !== currentUser.sub) {
      throw new ForbiddenException('You can only view documents for your own loans');
    }

    return this.documentModel
      .find({ loanId })
      .populate('uploadedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();
  }

  // ── Get own documents (borrower) ────────────────────────────────────────
  async getMyDocuments(currentUser: JwtPayload): Promise<DocumentRecord[]> {
    return this.documentModel
      .find({ uploadedBy: new Types.ObjectId(currentUser.sub) })
      .sort({ createdAt: -1 })
      .lean();
  }

  // ── Delete a document ────────────────────────────────────────────────────
  async deleteDocument(documentId: Types.ObjectId, currentUser: JwtPayload): Promise<void> {
    const document = await this.documentModel.findById(documentId);
    if (!document) throw new NotFoundException('Document not found');

    // Only uploader or admin can delete
    if (currentUser.role !== Role.Admin && document.uploadedBy.toString() !== currentUser.sub) {
      throw new ForbiddenException('You can only delete your own documents');
    }

    // Remove from Cloudinary first
    await this.cloudinaryService.deleteFile(document.cloudinaryPublicId);

    await this.documentModel.findByIdAndDelete(documentId);
    this.logger.log(`Document ${documentId.toString()} deleted by ${currentUser.email}`);
  }
}
