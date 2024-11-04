import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckoutBodyDto } from 'src/monobank/dto/checkout.body.dto';
import { MonobankService } from 'src/monobank/monobank.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: MonobankService) {}
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
}
