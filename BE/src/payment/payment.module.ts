import { Module } from '@nestjs/common';
import { MonobankModule } from 'src/monobank/monobank.module';

@Module({})
export class PaymentModule {
  imports: [MonobankModule];
}
