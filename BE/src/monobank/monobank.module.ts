import { Module } from '@nestjs/common';
import { MonobankController } from './monobank.controller';
import { MonobankService } from './monobank.service';

@Module({
  controllers: [MonobankController],
  providers: [MonobankService],
})
export class MonobankModule {}
