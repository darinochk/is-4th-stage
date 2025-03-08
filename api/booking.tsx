import {api, DefaultErrorHandler, Message} from "@/api/api";


//GET /bookings/: Получить все бронирования (только для админа).
// GET /bookings/user: Получить бронирования для текущего пользователя.
// POST /bookings/create: Создать новое бронирование.
// PUT /bookings/update/{id}: Обновить бронирование (только для владельца).
// DELETE /bookings/delete/{id}: Удалить бронирование (только для владельца).


export async function CreateBooking(payload: any, setMessage: (message: Message) => void) {
    try {
        const res = await api.post('/bookings/create', payload);
        setMessage({isError: false, message: "Бронирование создано"});
    } catch (err: any) {
        DefaultErrorHandler(setMessage)(err);
    }
}