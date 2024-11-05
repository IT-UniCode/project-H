import type { PaymentUrl } from "@interfaces/index";
import apiService from "./api.service";
import { ApiPath, type Currency } from "@constant/index";

class PaymentService {
  checkoutFundraising(body: {
    amount: number;
    currency: Currency;
    fundraisingId: string;
  }) {
    return apiService.post<PaymentUrl>(ApiPath.paymentCheckout, { body });
  }
}

export default new PaymentService();
