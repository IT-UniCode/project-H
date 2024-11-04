import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutBodyDto } from './dto/checkout.body.dto';
import { MonobankCurrencyEnum } from 'src/types';

@ApiTags('monobank')
@Controller('monobank')
export class MonobankController {
  @Post('/checkout')
  async getInvoice(
    @Body()
    body: CheckoutBodyDto,
  ) {
    if (!body.amount || body.amount < 100) {
      throw new BadRequestException(`Bad amount: ${body.amount}`);
    }

    const req = await fetch(
      'https://api.monobank.ua/api/merchant/invoice/create',
      {
        headers: { 'X-Token': 'uMVo10oSK6-2LhhvOtvHP6eYXvy5anOyS_2Ym8t6NVqA' },
        body: JSON.stringify({
          amount: body.amount * 100,
          webHookUrl: 'https://web-hook-test.onrender.com/',
          ccy: +MonobankCurrencyEnum[body?.currency || 'uah'],
          ...body.merchantPaymInfo,
        }),
        method: 'POST',
      },
    );

    const response = await req.json();
    return { url: response.pageUrl };
  }
}
