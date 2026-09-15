import { Module } from '@nestjs/common';
import { GbfsService } from './gbfs.service';

@Module({
  imports: [],
  providers: [GbfsService],
  exports: [GbfsService],
})
export class GbfsModule {}
