import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CheckoutBodyDto } from 'src/payment/dto/checkout.body.dto';
// import { MonobankService } from 'src/monobank/monobank.service';
import { StripeService } from 'src/stripe/stripe.service';
import { CheckoutResponseDto } from './dto/checkout.response.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { WebhookBodyDto } from './dto/webhook.body.dto';
import { AuthGuard } from 'src/guard/user.guard';
import { RequestService } from 'src/request/request.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: StripeService,
    private readonly requestService: RequestService,
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    example: { url: 'https://pay.monobank.ua/2411049WJtiaShSv7qmJ' },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/checkout')
  async getCheckoutUrl(
    @Body()
    body: CheckoutBodyDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.paymentService.pay(body, req.user.id);
  }

  @ApiExcludeEndpoint()
  @Post('/webhook')
  async webhook(
    @Body()
    body: WebhookBodyDto,
  ): Promise<CheckoutResponseDto> {
    const data = body.data.object;
    const metadata = body.data.object.metadata;

    return this.requestService.post('/fundraising-payments', {
      body: {
        data: {
          total: data.amount_total,
          currency: data.currency,
          ...metadata,
        },
      },
    });
  }
}
