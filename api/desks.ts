

// 3. Desk (Стол)
// Представляет стол в кафе. Содержит:
// id: Уникальный ID стола.
// deskNumber: Номер стола (идентификатор).
// capacity: Вместимость стола (сколько людей может разместиться).
// location: Местоположение стола (например, "у окна").

import {api, DefaultErrorHandler, Message} from "@/api/api";

export interface Desk {
    id: number;
    deskNumber: number;
    capacity: number;
    location: string;
}

//3. DeskController
// Управляет столами:
// GET /desks/: Получить все столы.
// POST /desks/create: Создать новый стол (только для админа).
// PUT /desks/update/{id}: Обновить данные стола (только для админа).
// DELETE /desks/delete/{id}: Удалить стол (только для админа).

export async function GetDesks(): Promise<Desk[]> {
    try {
        const res = await api.get('/desks/');
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function CreateDesk(desk: any, setResponse: (message: Message | null) => void): Promise<Desk | null> {
    try {
        const res = await api.post('/desks/create', desk);
        setResponse({isError: false, message: "Стол создан"});
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(setResponse)(err);
        return null;
    }
}