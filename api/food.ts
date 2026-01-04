import { api, DefaultErrorHandler, Message } from "@/api/api";

export interface Food {
  id: number;
  name: string;
  price: number;
  foodType: string;
}

export async function GetFood(): Promise<Food[]> {
  try {
    const res = await api.get("/food/");
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
    return [];
  }
}

export async function CreateFood(
  eventRequest: any,
  setMessage: (mess: Message) => void
): Promise<Food | null> {
  try {
    const res = await api.post("/food/create", eventRequest);
    setMessage({ isError: false, message: "Еда добавлена" });
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(setMessage)(err);
    return null;
  }
}

export async function UpdateFood(
  id: number,
  eventRequest: any,
  setMessage: (mess: Message) => void
): Promise<Food | null> {
  try {
    const res = await api.put(`/food/update/${id}`, eventRequest);
    setMessage({ isError: false, message: "Еда обновлена" });
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(setMessage)(err);
    return null;
  }
}

export async function DeleteFood(id: number): Promise<void> {
  try {
    await api.delete(`/food/delete/${id}`);
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
  }
}
