import { api, DefaultErrorHandler, Message } from "@/api/api";

export interface Desk {
  id: number;
  deskNumber: number;
  capacity: number;
  location: string;
}

export async function GetDesks(): Promise<Desk[]> {
  try {
    const res = await api.get("/desks/");
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
    return [];
  }
}

export async function CreateDesk(
  desk: any,
  setResponse: (message: Message | null) => void
): Promise<Desk | null> {
  try {
    const res = await api.post("/desks/create", desk);
    setResponse({ isError: false, message: "Стол создан" });
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(setResponse)(err);
    return null;
  }
}

export async function DeleteDesk(id: number) {
  try {
    const res = await api.delete("/desks/delete/" + id);
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
  }
}

export async function UpdateDesk(id: number, desk: any) {
  try {
    const res = await api.put("/desks/update/" + id, desk);
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
  }
}
