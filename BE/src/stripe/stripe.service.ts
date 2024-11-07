import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CheckoutBodyDto } from 'src/payment/dto/checkout.body.dto';
import { RequestService } from 'src/request/request.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private readonly requestService: RequestService,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-10-28.acacia',
    });
  }

  async pay(body: CheckoutBodyDto, userId: number) {
    if (!body.amount) {
      throw new BadRequestException(`Invalid amount: ${body.amount}`);
    }

    const path = `/fundraisings/${body.fundraisingId}`;

    const fundraising = await this.requestService.get(path).catch(() => {
      throw new BadRequestException(
        `This fundraising with id ${body.fundraisingId} does not exist`,
      );
    });

    const session = await this.stripe.checkout.sessions.create({
      success_url: body?.redirectUrl || process.env.STRIPE_SUCCESS_URL,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: body.currency,
            product_data: {
              name: fundraising.data.title || 'Donation',
            },
            unit_amount: body.amount * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      metadata: {
        fundraisingId: body.fundraisingId,
        paymentApi: 'stripe',
        userId,
      },
    });
    return { url: session.url };
  }

  public getType(request, rawBody) {
    const sig = request.headers['stripe-signature'];

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      sig,
      'whsec_emCAW0OwjNteGLwg9sVL7XgaBr52UaRX',
    );

    return event.type;
  }

  async getLocaleAmount(paymentIntentId: string) {
    const { latest_charge } =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const { balance_transaction } = await this.stripe.charges.retrieve(
      latest_charge as string,
    );

    if (!balance_transaction) {
      throw new BadRequestException();
    }

    const { amount } = await this.stripe.balanceTransactions.retrieve(
      String(balance_transaction),
    );

    return amount;
  }
}
