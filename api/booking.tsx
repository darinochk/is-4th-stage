import {api, DefaultErrorHandler, Message} from "@/api/api";

//     private Long id;
//     private String userName;
//     private String deskLocation;
//     private Date startDate;
//     private Date endDate;
//     private String status;

export interface Booking {
    id: number;
    userName: string;
    deskLocation: string;
    startDate: Date;
    endDate: Date;
    status: string;
}

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

export async function GetBookings(): Promise<Booking[]> {
    try {
        const res = await api.get('/bookings/user');
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.startDate = new Date(booking.startDate), booking));
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.endDate = new Date(booking.endDate), booking));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function DeleteBooking(id: number) {
    try {
        const res = await api.delete(`/bookings/delete/${id}`);
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
    }
}

export async function GetBookingsByDesk(deskId: number): Promise<Booking[]> {
    try {
        const res = await api.get(`/bookings/desk/${deskId}`);
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.startDate = new Date(booking.startDate), booking));
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.endDate = new Date(booking.endDate), booking));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function GetAdminBookings(): Promise<Booking[]> {
    try {
        const res = await api.get('/bookings/');
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.startDate = new Date(booking.startDate), booking));
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.endDate = new Date(booking.endDate), booking));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}