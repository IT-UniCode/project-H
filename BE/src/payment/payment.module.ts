import { Module } from '@nestjs/common';
import { MonobankModule } from 'src/monobank/monobank.module';
import { PaymentController } from './payment.controller';
import { MonobankService } from 'src/monobank/monobank.service';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [StripeModule.forRootAsync(), MonobankModule],
  controllers: [PaymentController],
  providers: [MonobankService],
})
export class PaymentModule {}
