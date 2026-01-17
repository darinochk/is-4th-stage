import { api, DefaultErrorHandler, Message } from "@/api/api";

export interface Payment {
  id: number;
  fullName: string;
  email: string;
  description: string;
  orderDate: Date;
  amount: number;
  transaction: {
    id: number;
    status: string;
  };
}

export async function InitPayment(orderDetailsId: number): Promise<Payment> {
  try {
    const res = await api.post("/payments/init/" + orderDetailsId);
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
    return {} as Payment;
  }
}

export async function PayForOrder(
  paymentSessionId: number,
  accountNumber: string,
  setMessage: (message: Message) => void
): Promise<Payment> {
  try {
    const res = await api.post(
      "/payments/pay/" + paymentSessionId + "?accountNumber=" + accountNumber
    );
    setMessage({ isError: false, message: "Статус оплаты: " + res.data?.transaction?.status });
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
    setMessage({ isError: true, message: JSON.stringify(err.response.data) });
    return {} as Payment;
  }
}
