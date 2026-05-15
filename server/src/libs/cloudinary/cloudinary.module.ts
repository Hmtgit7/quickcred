import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Global() // Available everywhere without re-importing
@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
