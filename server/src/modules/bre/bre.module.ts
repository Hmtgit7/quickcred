import { Module } from '@nestjs/common';
import { BREService } from './bre.service';

@Module({
  providers: [BREService],
  exports: [BREService],
})
export class BREModule {}
