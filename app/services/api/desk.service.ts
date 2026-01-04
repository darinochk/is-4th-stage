import { httpClient, ApiMessage } from "../http";
import { Desk } from "./types";

export class DeskService {
  async getDesks(): Promise<Desk[]> {
    try {
      return await httpClient.get<Desk[]>("/desks/");
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async createDesk(
    desk: any,
    setResponse: (message: ApiMessage | null) => void
  ): Promise<Desk | null> {
    try {
      const data = await httpClient.post<Desk>("/desks/create", desk);
      setResponse({ isError: false, message: "Стол создан" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setResponse);
      return null;
    }
  }

  async deleteDesk(id: number): Promise<void> {
    try {
      await httpClient.delete(`/desks/delete/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }

  async updateDesk(id: number, desk: any): Promise<Desk | null> {
    try {
      return await httpClient.put<Desk>(`/desks/update/${id}`, desk);
    } catch (err: any) {
      httpClient.handleError(err);
      return null;
    }
  }
}

export const deskService = new DeskService();
