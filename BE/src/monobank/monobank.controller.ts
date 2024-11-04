import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckoutBodyDto } from './dto/checkout.body.dto';
import { MonobankCurrencyEnum } from 'src/types';
import axios from 'axios';

@ApiTags('monobank')
@Controller('monobank')
export class MonobankController {
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: { url: 'https://pay.monobank.ua/2411049WJtiaShSv7qmJ' },
  })
  @Post('/checkout')
  async getInvoice(
    @Body()
    body: CheckoutBodyDto,
  ) {
    if (!body.amount || body.amount < 100) {
      throw new BadRequestException(`Bad amount: ${body.amount}`);
    }

    const req = await axios.post(
      'https://api.monobank.ua/api/merchant/invoice/create',
      {
        amount: body.amount * 100,
        webHookUrl: process.env.MONOBANK_WEBHOOK_URL,
        ccy: +MonobankCurrencyEnum[body?.currency || 'uah'],
        ...body.merchantPaymInfo,
      },
      {
        headers: { 'X-Token': process.env.MONOBANK_TOKEN },
      },
    );

    const response = await req.data;
    return { url: response.pageUrl };
  }
}
