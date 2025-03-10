import {api, DefaultErrorHandler} from "@/api/api";
import {Booking} from "@/api/booking";
import {Order, OrderDetails} from "@/api/order";


export async function GetWaiterBookings(): Promise<Booking[]> {
    try {
        const res = await api.get('/waiter/bookings');
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.startDate = new Date(booking.startDate), booking));
        res.data = (res.data as Booking[]).map((booking: Booking) => (booking.endDate = new Date(booking.endDate), booking));
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function GetWaiterOrders(): Promise<Order[]> {
    try {
        const res = await api.get('/waiter/orders');
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function GetWaiterOrdersDetails(): Promise<OrderDetails[]> {
    try {
        const res = await api.get('/waiter/orderDetails');
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
        return [];
    }
}

export async function ConfirmOrderDetails(orderDetailsId: number){
    try {
        const res = await api.put(`/waiter/confirmOrderDetails/${orderDetailsId}`);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
    }
}

export async function ConfirmBooking(bookingId: number) {
    try {
        const res = await api.put(`/waiter/confirmBooking/${bookingId}`);
        return res.data;
    } catch (err: any) {
        DefaultErrorHandler(() => {})(err);
    }
}