import { httpClient, ApiMessage } from "../http";
import { Food } from "./types";

export class FoodService {
  async getFood(): Promise<Food[]> {
    try {
      return await httpClient.get<Food[]>("/food/");
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async createFood(
    eventRequest: any,
    setMessage: (mess: ApiMessage) => void
  ): Promise<Food | null> {
    try {
      const data = await httpClient.post<Food>("/food/create", eventRequest);
      setMessage({ isError: false, message: "Еда добавлена" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async updateFood(
    id: number,
    eventRequest: any,
    setMessage: (mess: ApiMessage) => void
  ): Promise<Food | null> {
    try {
      const data = await httpClient.put<Food>(`/food/update/${id}`, eventRequest);
      setMessage({ isError: false, message: "Еда обновлена" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
      return null;
    }
  }

  async deleteFood(id: number): Promise<void> {
    try {
      await httpClient.delete(`/food/delete/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }
}

export const foodService = new FoodService();
