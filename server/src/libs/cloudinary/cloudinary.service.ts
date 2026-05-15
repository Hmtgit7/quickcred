import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    resourceType: 'image' | 'raw' = 'image'
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `quickcred/${folder}`,
          resource_type: resourceType,
          allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error);
            reject(new InternalServerErrorException('File upload failed'));
            return;
          }
          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.logger.warn(`Failed to delete Cloudinary file: ${publicId}`, error);
    }
  }
}
