import {api, DefaultErrorHandler, Message} from "@/api/api";
import {Booking} from "@/api/booking";

export interface CoffeeEvent {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
}

export type Promotion = CoffeeEvent;

export async function GetAllEvents(): Promise<CoffeeEvent[]> {
    try {
        const res = await api.get('/events/');
        res.data = (res.data as CoffeeEvent[]).map((booking: CoffeeEvent) => (booking.startDate = new Date(booking.startDate), booking));
        res.data = (res.data as CoffeeEvent[]).map((booking: CoffeeEvent) => (booking.endDate = new Date(booking.endDate), booking));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function CreateEvent(eventRequest: any, setMessage: (mess: Message) => void): Promise<CoffeeEvent | null> {
    try {
        const res = await api.post('/events/create', eventRequest);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(setMessage)(err);
        return null;
    }
}

export async function UpdateEvent(id: number, eventRequest: any, setMessage: (mess: Message) => void): Promise<CoffeeEvent | null> {
    try {
        const res = await api.put(`/events/update/${id}`, eventRequest);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(setMessage)(err);
        return null;
    }
}

export async function DeleteEvent(id: number): Promise<void> {
    try {
        await api.delete(`/events/delete/${id}`);
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
    }
}

export async function GetAllPromotions(): Promise<Promotion[]> {
    try {
        const res = await api.get('/promotions/');
        res.data = (res.data as CoffeeEvent[]).map((booking: CoffeeEvent) => (booking.startDate = new Date(booking.startDate), booking));
        res.data = (res.data as CoffeeEvent[]).map((booking: CoffeeEvent) => (booking.endDate = new Date(booking.endDate), booking));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function CreatePromotion(eventRequest: any, setMessage: (mess: Message) => void): Promise<Promotion | null> {
    try {
        const res = await api.post('/promotions/create', eventRequest);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(setMessage)(err);
        return null;
    }
}

export async function UpdatePromotion(id: number, eventRequest: any, setMessage: (mess: Message) => void): Promise<Promotion | null> {
    try {
        const res = await api.put(`/promotions/update/${id}`, eventRequest);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(setMessage)(err);
        return null;
    }
}

export async function DeletePromotion(id: number): Promise<void> {
    try {
        await api.delete(`/promotions/delete/${id}`);
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
    }
}