import { DynamicModule, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestService } from 'src/request/request.service';

@Module({
  providers: [StripeService],
})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        StripeService,
        RequestService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (configService: ConfigService) =>
            configService.get('STRIPE_API_KEY'),
          inject: [ConfigService],
        },
      ],
      exports: [StripeService],
    };
  }
}
