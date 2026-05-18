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

  async uploadDocument(
    file: Express.Multer.File,
    dto: UploadDocumentDto,
    currentUser: JwtPayload
  ): Promise<DocumentRecord> {
    const allowedMimeTypes = FILE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type "${file.mimetype}". Allowed: PDF, JPG, PNG`);
    }

    let loanObjectId: Types.ObjectId | null = null;
    if (dto.loanId) {
      if (!Types.ObjectId.isValid(dto.loanId)) {
        throw new BadRequestException('Invalid loan ID format');
      }
      loanObjectId = new Types.ObjectId(dto.loanId);
      const loan = await this.loanModel.findById(loanObjectId).lean();
      if (!loan) throw new NotFoundException('Loan not found');

      if (currentUser.role === Role.Borrower && loan.borrowerId.toString() !== currentUser.sub) {
        throw new ForbiddenException('You can only attach documents to your own loans');
      }
    }

    // FIX: was calling uploadBuffer() — method is uploadFile() with different signature
    const uploaded = await this.cloudinaryService.uploadBuffer(
      file.buffer,
      'documents',
      file.mimetype === 'application/pdf' ? 'raw' : 'image'
    );

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

  async getMyDocuments(currentUser: JwtPayload): Promise<DocumentRecord[]> {
    return this.documentModel
      .find({ uploadedBy: new Types.ObjectId(currentUser.sub) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async deleteDocument(documentId: Types.ObjectId, currentUser: JwtPayload): Promise<void> {
    const document = await this.documentModel.findById(documentId);
    if (!document) throw new NotFoundException('Document not found');

    if (currentUser.role !== Role.Admin && document.uploadedBy.toString() !== currentUser.sub) {
      throw new ForbiddenException('You can only delete your own documents');
    }

    await this.cloudinaryService.deleteFile(document.cloudinaryPublicId);
    await this.documentModel.findByIdAndDelete(documentId);
    this.logger.log(`Document ${documentId.toString()} deleted by ${currentUser.email}`);
  }
}
