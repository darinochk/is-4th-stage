import { httpClient, ApiMessage } from "../http";
import { Booking } from "./types";

export class BookingService {
  async createBooking(payload: any, setMessage: (message: ApiMessage) => void): Promise<void> {
    try {
      await httpClient.post("/bookings/create", payload);
      setMessage({ isError: false, message: "Бронирование создано" });
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
    }
  }

  async getBookings(): Promise<Booking[]> {
    try {
      const bookings = await httpClient.get<Booking[]>("/bookings/user");
      return this.mapBookingDates(bookings);
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async deleteBooking(id: number): Promise<void> {
    try {
      await httpClient.delete(`/bookings/delete/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }

  async getBookingsByDesk(deskId: number): Promise<Booking[]> {
    try {
      const bookings = await httpClient.get<Booking[]>(`/bookings/desk/${deskId}`);
      return this.mapBookingDates(bookings);
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async getAdminBookings(): Promise<Booking[]> {
    try {
      const bookings = await httpClient.get<Booking[]>("/bookings/");
      return this.mapBookingDates(bookings);
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  private mapBookingDates(bookings: Booking[]): Booking[] {
    return bookings.map((booking) => ({
      ...booking,
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate),
    }));
  }
}

export const bookingService = new BookingService();
