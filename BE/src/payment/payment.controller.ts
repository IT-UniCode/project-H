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

    const fundraising = await this.requestService.get(
      `/fundraisings/${metadata.fundraisingId}`,
    );

    await this.requestService.put(`/fundraisings/${metadata.fundraisingId}`, {
      body: {
        data: {
          current_sum: fundraising.data.current_sum + data.amount_total / 100,
        },
      },
    });

    return this.requestService.post('/fundraising-payments', {
      body: {
        data: {
          total: await this.paymentService.getLocaleAmount(data.payment_intent),
          currency: 'usd',
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
    const paymentsList = {};
    const ids = params.id.split(',');

    await Promise.all(
      ids.map(async (id) => {
        paymentsList[id] = [];

        const payments = await this.requestService.get(
          `/fundraising-payments?filters[fundraisingId][$eq]=${id}&pagination[limit]=30&fields=total,userId,currency&sort[0]=currency&sort[1]=total`,
        );

        if (payments.data.length > 0) {
          payments.data.forEach((pay) => {
            const { total, userId, currency } = pay;
            paymentsList[id].push({ total, userId, currency });
          });
        } else {
          paymentsList[id] = null;
        }

        if (paymentsList[id]) {
          paymentsList[id].sort(this.sortByTotal).slice(0, 10);
        }
      }),
    );

    return paymentsList;
  }
}
