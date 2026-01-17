import { api, DefaultErrorHandler, Message } from "@/api/api";
import { IntUser, Role, useUserStore } from "@/context/user-store";
import { EffectCallback, useEffect } from "react";

export async function Register(payload: any, setMessage: (message: Message) => void) {
  try {
    const res = await api.post("/account/register", payload);
    useUserStore.getState().Login(res.data.user, res.data.token);
    setMessage({ isError: false, message: "Ваш аккаунт создан!" });
  } catch (err: any) {
    DefaultErrorHandler(setMessage)(err);
  }
}

export async function Login(
  email: string,
  password: string,
  setMessage: (message: Message) => void
) {
  try {
    const res = await api.post("/account/login", { email, password });
    useUserStore.getState().Login(res.data.user, res.data.token);
    setMessage({ isError: false, message: "Вы вошли в аккаунт!" });
  } catch (err: any) {
    DefaultErrorHandler(setMessage)(err);
  }
}

export function useAuthEffect(effect: EffectCallback, deps?: React.DependencyList) {
  const state = useUserStore();

  useEffect(
    () => {
      if (state.inited && state.user) {
        effect();
      }
    },
    (deps || []).concat(state)
  );
}

export async function GetUsers(): Promise<IntUser[]> {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
    return [];
  }
}

export async function UpdateUser(payload: any, setError: (err: Message) => void) {
  try {
    const res = await api.put("/users/update", payload);
    setError({ isError: false, message: "Данные обновлены" });
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(setError)(err);
    return null;
  }
}

export async function DeleteUser(id?: number) {
  if (id == undefined) id = useUserStore.getState().user?.id;
  try {
    const res = await api.delete("/users/delete/" + id);
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
  }
}

export async function AdminDeleteUser(id: number) {
  try {
    const res = await api.delete("/admin/deleteUser/" + id);
  } catch (err: any) {
    DefaultErrorHandler(() => {})(err);
  }
}

export async function AdminUpdateUser(
  id: number,
  payload: any,
  setError: (err: Message) => void
): Promise<IntUser | null> {
  try {
    const res = await api.put("/admin/updateUser/" + id, payload);
    setError({ isError: false, message: "Данные обновлены" });
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(setError)(err);
    return null;
  }
}

export async function AdminSetUserRole(
  id: number,
  role: Role,
  setError: (err: Message) => void
): Promise<IntUser | null> {
  try {
    const res = await api.put("/admin/assignRole/" + id + "?role=" + role);
    setError({ isError: false, message: "Данные обновлены" });
    return res.data;
  } catch (err: any) {
    DefaultErrorHandler(setError)(err);
    return null;
  }
}
