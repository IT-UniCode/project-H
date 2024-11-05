import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CheckoutBodyDto } from 'src/payment/dto/checkout.body.dto';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-10-28.acacia',
    });
  }

  async pay(body: CheckoutBodyDto) {
    if (!body.amount) {
      throw new BadRequestException(`Invalid amount: ${body.amount}`);
    }

    const session = await this.stripe.checkout.sessions.create({
      success_url: process.env.STRIPE_SUCCESS_URL,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: body.currency,
            product_data: {
              name: 'Donation',
            },
            unit_amount: body.amount * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      metadata: { fundraisingId: body.fundraisingId },
    });
    return { url: session.url };
  }
}
