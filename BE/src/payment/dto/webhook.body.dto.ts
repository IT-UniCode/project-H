export class WebhookBodyDto {
  data: {
    object: {
      metadata: {
        fundraisingId: string;
        userId: number;
        paymentApi: string;
      };
      currency: string;
      amount_total: number;
      payment_intent: string;
    };
  };
}
