import { httpClient, ApiMessage } from "../http";
import { CoffeeEvent, Promotion } from "./types";

export class EventService {
  async getAllEvents(): Promise<CoffeeEvent[]> {
    try {
      const events = await httpClient.get<CoffeeEvent[]>("/events/");
      return this.mapEventDates(events);
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async createEvent(
    eventRequest: any,
    setMessage: (mess: ApiMessage) => void
  ): Promise<CoffeeEvent | null> {
    try {
      return await httpClient.post<CoffeeEvent>("/events/create", eventRequest);
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async updateEvent(
    id: number,
    eventRequest: any,
    setMessage: (mess: ApiMessage) => void
  ): Promise<CoffeeEvent | null> {
    try {
      return await httpClient.put<CoffeeEvent>(`/events/update/${id}`, eventRequest);
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async deleteEvent(id: number): Promise<void> {
    try {
      await httpClient.delete(`/events/delete/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }

  async getAllPromotions(): Promise<Promotion[]> {
    try {
      const promotions = await httpClient.get<Promotion[]>("/promotions/");
      return this.mapEventDates(promotions);
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async createPromotion(
    eventRequest: any,
    setMessage: (mess: ApiMessage) => void
  ): Promise<Promotion | null> {
    try {
      return await httpClient.post<Promotion>("/promotions/create", eventRequest);
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async updatePromotion(
    id: number,
    eventRequest: any,
    setMessage: (mess: ApiMessage) => void
  ): Promise<Promotion | null> {
    try {
      return await httpClient.put<Promotion>(`/promotions/update/${id}`, eventRequest);
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async deletePromotion(id: number): Promise<void> {
    try {
      await httpClient.delete(`/promotions/delete/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }

  private mapEventDates(events: CoffeeEvent[]): CoffeeEvent[] {
    return events.map((event) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    }));
  }
}

export const eventService = new EventService();
