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

export async function ConfirmOrder(id: number): Promise<OrderDetails> {
    try {
        const res = await api.get('/order-details/confirm_details/' + id);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return {orderDetailsId: 0, totalAmount: 0, orders: []};
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