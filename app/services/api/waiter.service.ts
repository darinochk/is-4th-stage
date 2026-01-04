import { httpClient } from "../http";
import { Booking, Order, OrderDetails } from "./types";

export class WaiterService {
  async getWaiterBookings(): Promise<Booking[]> {
    try {
      const bookings = await httpClient.get<Booking[]>("/waiter/bookings");
      return bookings.map((booking) => ({
        ...booking,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
      }));
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async getWaiterOrders(): Promise<Order[]> {
    try {
      return await httpClient.get<Order[]>("/waiter/orders");
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async getWaiterOrdersDetails(): Promise<OrderDetails[]> {
    try {
      return await httpClient.get<OrderDetails[]>("/waiter/orderDetails");
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async confirmOrderDetails(orderDetailsId: number): Promise<OrderDetails | null> {
    try {
      return await httpClient.put<OrderDetails>(`/waiter/confirmOrderDetails/${orderDetailsId}`);
    } catch (err: any) {
      httpClient.handleError(err);
      return null;
    }
  }

  async confirmBooking(bookingId: number): Promise<Booking | null> {
    try {
      return await httpClient.put<Booking>(`/waiter/confirmBooking/${bookingId}`);
    } catch (err: any) {
      httpClient.handleError(err);
      return null;
    }
  }
}

export const waiterService = new WaiterService();
