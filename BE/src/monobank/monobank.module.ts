import { Module } from '@nestjs/common';
import { MonobankController } from './monobank.controller';

@Module({
  controllers: [MonobankController],
})
export class MonobankModule {}
