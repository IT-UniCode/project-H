import { Injectable } from '@nestjs/common';
import { WebhookBodyDto } from 'src/payment/dto/webhook.body.dto';
import { RequestService } from 'src/request/request.service';
import { StripeService } from './stripe.service';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly requestService: RequestService,
    private readonly stripeService: StripeService,
  ) {}

  async sessionHandler(body: WebhookBodyDto) {
    const data = body.data.object;
    const metadata = body.data.object.metadata;

    this.stripeService.updatePayment(data.payment_intent, metadata);
  }

  async chargeHandler(body: WebhookBodyDto) {
    const { balance_transaction, payment_intent } = body.data.object;

    const amount =
      await this.stripeService.getLocaleAmount(balance_transaction);

    const metadata = await this.stripeService.getMetadata(payment_intent);

    const fundraising = await this.requestService.get(
      `/fundraisings/${metadata.fundraisingId}?fields=current_sum`,
    );

    await this.requestService.put(`/fundraisings/${metadata.fundraisingId}`, {
      body: {
        data: {
          current_sum: Number(
            fundraising.data.current_sum + amount / 100,
          ).toFixed(0),
        },
      },
    });

    await this.requestService.post('/fundraising-payments', {
      body: {
        data: {
          total: amount,
          currency: 'usd',
          ...metadata,
        },
      },
    });
  }
}
