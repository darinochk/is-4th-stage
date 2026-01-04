import { httpClient, ApiMessage } from "../http";
import { Payment } from "./types";

export class PaymentService {
  async initPayment(orderDetailsId: number): Promise<Payment> {
    try {
      return await httpClient.post<Payment>(`/payments/init/${orderDetailsId}`);
    } catch (err: any) {
      httpClient.handleError(err);
      return {} as Payment;
    }
  }

  async payForOrder(
    paymentSessionId: number,
    accountNumber: string,
    setMessage: (message: ApiMessage) => void
  ): Promise<Payment> {
    try {
      const data = await httpClient.post<Payment>(
        `/payments/pay/${paymentSessionId}?accountNumber=${accountNumber}`
      );
      setMessage({
        isError: false,
        message: "Статус оплаты: " + data?.transaction?.status,
      });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      if (err.response?.data) {
        setMessage({ isError: true, message: JSON.stringify(err.response.data) });
      }
      return {} as Payment;
    }
  }
}

export const paymentService = new PaymentService();
