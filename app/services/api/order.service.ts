import { httpClient, ApiMessage } from "../http";
import { Order, OrderDetails } from "./types";

export class OrderService {
  async startOrder(id: number): Promise<number> {
    try {
      const data = await httpClient.post<OrderDetails>("/order-details/create", { bookingId: id });
      return data.orderDetailsId;
    } catch (err: any) {
      httpClient.handleError(err);
      return 0;
    }
  }

  async confirmOrder(id: number): Promise<OrderDetails | null> {
    try {
      return await httpClient.get<OrderDetails>(`/order-details/confirm_details/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
      return null;
    }
  }

  async addFoodToOrder(
    payload: any,
    setMessage: (message: ApiMessage) => void
  ): Promise<Order | null> {
    try {
      const data = await httpClient.post<Order>("/orders/create", payload);
      setMessage({ isError: false, message: "Блюдо добавлено в заказ" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async getOrderByBooking(id: number): Promise<OrderDetails | null> {
    try {
      return await httpClient.get<OrderDetails>(`/order-details/get/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
      return null;
    }
  }

  async removeFoodFromOrder(id: number): Promise<void> {
    try {
      await httpClient.delete(`/orders/delete/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }
}

export const orderService = new OrderService();
