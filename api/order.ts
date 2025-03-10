import {api, DefaultErrorHandler, Message} from "@/api/api";

export interface Order {
    id: number;
    foodName: string;
    quantity: number;
    totalPrice: number;
    orderDetailsId: number;
}

export interface OrderDetails {
    orderDetailsId: number;
    totalAmount: number;
    orders: Order[];
    status: string;
}

export async function StartOrder(id: number): Promise<number> {
    try {
        const res = await api.post('/order-details/create', {bookingId: id});
        return (res.data as OrderDetails).orderDetailsId;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return 0;
    }
}

export async function ConfirmOrder(id: number): Promise<OrderDetails | null> {
    try {
        const res = await api.get('/order-details/confirm_details/' + id);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return null;
    }
}

export async function AddFoodToOrder(payload: any, setMessage: (message: Message) => void): Promise<Order | null> {
    try {
        const res = await api.post('/orders/create', payload);
        setMessage({isError: false, message: "Блюдо добавлено в заказ"});
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(setMessage)(err);
        return null;
    }
}

export async function GetOrderByBooking(id: number): Promise<OrderDetails | null> {
    try {
        const res = await api.get('/order-details/get/' + id);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return null;
    }
}

export async function RemoveFoodFromOrder(id: number) {
    try {
        const res = await api.delete('/orders/delete/' + id);
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
    }
}