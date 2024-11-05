import { Module } from '@nestjs/common';
import { MonobankModule } from 'src/monobank/monobank.module';
import { PaymentController } from './payment.controller';
import { MonobankService } from 'src/monobank/monobank.service';
import { StripeModule } from 'src/stripe/stripe.module';
import { RequestService } from 'src/request/request.service';

@Module({
  imports: [StripeModule.forRootAsync(), MonobankModule],
  controllers: [PaymentController],
  providers: [MonobankService, RequestService],
})
export class PaymentModule {}
