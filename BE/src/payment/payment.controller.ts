import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckoutBodyDto } from 'src/payment/dto/checkout.body.dto';
// import { MonobankService } from 'src/monobank/monobank.service';
import { StripeService } from 'src/stripe/stripe.service';
// import { CheckoutResponseDto } from './dto/checkout.response.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: StripeService) {}
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: { url: 'https://pay.monobank.ua/2411049WJtiaShSv7qmJ' },
  })
  @Post('/checkout')
  async getInvoice(
    @Body()
    body: CheckoutBodyDto,
  ) {
    return this.paymentService.pay(body);
  }

  //   @Post('/webhook')
  //   async postEcho(@Body() body: any): Promise<CheckoutResponseDto> {
  //     console.log('body:', body);
  //     console.log('metadata:', body.data.object.metadata);
  //
  //     const
  //
  //     return {};
  //   }
}
