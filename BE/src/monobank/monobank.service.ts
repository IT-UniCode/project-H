import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PaymentCurrencyCodeEnum } from 'src/types';
import { CheckoutBodyDto } from '../payment/dto/checkout.body.dto';

@Injectable()
export class MonobankService {
  async pay(body: CheckoutBodyDto) {
    if (!body.amount || body.amount < 100) {
      throw new BadRequestException(`Bad amount: ${body.amount}`);
    }
    const req = await axios.post(
      'https://api.monobank.ua/api/merchant/invoice/create',
      {
        amount: body.amount * 100,
        webHookUrl: process.env.MONOBANK_WEBHOOK_URL,
        ccy: +PaymentCurrencyCodeEnum[body?.currency || 'uah'],
        ...body,
      },
      {
        headers: { 'X-Token': process.env.MONOBANK_TOKEN },
      },
    );
    const response = await req.data;
    return { url: response.pageUrl };
  }
}
