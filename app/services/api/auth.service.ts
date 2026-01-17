import { httpClient, ApiMessage } from "../http";
import { IntUser, Role } from "./types";
import { useUserStore } from "@/context/user-store";

export class AuthService {
  async register(payload: any, setMessage: (message: ApiMessage) => void): Promise<void> {
    try {
      const data = await httpClient.post<{ user: IntUser; token: string }>(
        "/account/register",
        payload
      );
      useUserStore.getState().Login(data.user, data.token);
      setMessage({ isError: false, message: "Ваш аккаунт создан!" });
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
    }
  }

  async login(
    email: string,
    password: string,
    setMessage: (message: ApiMessage) => void
  ): Promise<void> {
    try {
      const data = await httpClient.post<{ user: IntUser; token: string }>("/account/login", {
        email,
        password,
      });
      useUserStore.getState().Login(data.user, data.token);
      setMessage({ isError: false, message: "Вы вошли в аккаунт!" });
    } catch (err: any) {
      httpClient.handleError(err, setMessage);
    }
  }

  async getUsers(): Promise<IntUser[]> {
    try {
      return await httpClient.get<IntUser[]>("/admin/users");
    } catch (err: any) {
      httpClient.handleError(err);
      return [];
    }
  }

  async updateUser(payload: any, setError: (err: ApiMessage) => void): Promise<IntUser | null> {
    try {
      const data = await httpClient.put<IntUser>("/users/update", payload);
      setError({ isError: false, message: "Данные обновлены" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setError);
      return null;
    }
  }

  async deleteUser(id?: number): Promise<void> {
    const userId = id ?? useUserStore.getState().user?.id;
    if (!userId) return;

    try {
      await httpClient.delete(`/users/delete/${userId}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }

  async adminDeleteUser(id: number): Promise<void> {
    try {
      await httpClient.delete(`/admin/deleteUser/${id}`);
    } catch (err: any) {
      httpClient.handleError(err);
    }
  }

  async adminUpdateUser(
    id: number,
    payload: any,
    setError: (err: ApiMessage) => void
  ): Promise<IntUser | null> {
    try {
      const data = await httpClient.put<IntUser>(`/admin/updateUser/${id}`, payload);
      setError({ isError: false, message: "Данные обновлены" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setError);
      return null;
    }
  }

  async adminSetUserRole(
    id: number,
    role: Role,
    setError: (err: ApiMessage) => void
  ): Promise<IntUser | null> {
    try {
      const data = await httpClient.put<IntUser>(`/admin/assignRole/${id}?role=${role}`);
      setError({ isError: false, message: "Данные обновлены" });
      return data;
    } catch (err: any) {
      httpClient.handleError(err, setError);
      return null;
    }
  }
}

export const authService = new AuthService();
