export interface Document {
  _id: string;
  borrowerId: string;
  loanId?: string;
  type: string;
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}
