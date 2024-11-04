import { Module } from '@nestjs/common';
import { MonobankModule } from 'src/monobank/monobank.module';
import { PaymentController } from './payment.controller';
import { MonobankService } from 'src/monobank/monobank.service';

@Module({
  controllers: [PaymentController],
  imports: [MonobankModule],
  providers: [MonobankService],
})
export class PaymentModule {}
