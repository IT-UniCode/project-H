import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CheckoutBodyDto } from 'src/payment/dto/checkout.body.dto';
// import { MonobankService } from 'src/monobank/monobank.service';
import { StripeService } from 'src/stripe/stripe.service';
import { CheckoutResponseDto } from './dto/checkout.response.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { WebhookBodyDto } from './dto/webhook.body.dto';
import { RequestService } from 'src/request/request.service';
import { OptionalAuthGuard } from 'src/guard/optional.auth.guard';
import { GetListDto } from './dto/get.list.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: StripeService,
    private readonly requestService: RequestService,
  ) {}

  private readonly sortByTotal = (a, b) => {
    return (
      b.total * (b.currency === 'uah' ? 1 : b.currency === 'usd' ? 2 : 3) -
      a.total * (a.currency === 'uah' ? 1 : a.currency === 'usd' ? 2 : 3)
    );
  };

  @ApiResponse({
    status: HttpStatus.CREATED,
    example: { url: 'https://pay.monobank.ua/2411049WJtiaShSv7qmJ' },
  })
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @Post('/checkout')
  async getCheckoutUrl(
    @Body()
    body: CheckoutBodyDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.paymentService.pay(body, req.user?.id || 0);
  }

  @ApiExcludeEndpoint()
  @Post('/webhook')
  async webhook(
    @Body()
    body: WebhookBodyDto,
  ): Promise<CheckoutResponseDto> {
    const data = body.data.object;
    const metadata = body.data.object.metadata;

    await this.requestService.put(`/fundraising/${metadata.fundraisingId}`, {});

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

  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListDto,
  })
  @Get('/list/:id')
  async getList(@Param() params: { id: string }) {
    const payments = {};
    const ids = params.id.split(',');

    await Promise.all(
      ids.map(async (id) => {
        payments[id] = [];

        const ans = await this.requestService.get(
          `/fundraising-payments?filters[fundraisingId][$eq]=${id}&pagination[limit]=30&fields=total,userId,currency&sort[0]=currency&sort[1]=total`,
        );

        if (ans.data.length > 0) {
          ans.data.forEach((pay) => {
            const { total, userId, currency } = pay;
            payments[id].push({ total, userId, currency });
          });
        } else {
          payments[id] = null;
        }

        if (payments[id]) {
          payments[id].sort(this.sortByTotal).slice(0, 10);
        }
      }),
    );

    return payments;
  }
}
