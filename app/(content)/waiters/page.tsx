'use client'
import styles from "./page.module.css";
import {useState} from "react";
import {Booking} from "@/api/booking";
import {useAuthEffect} from "@/api/auth";
import {ConfirmOrder, Order, OrderDetails, StartOrder} from "@/api/order";
import {ConfirmBooking, GetWaiterBookings, GetWaiterOrders, GetWaiterOrdersDetails} from "@/api/waiter";

export default function Page() {
    const [bookings, setBookings] = useState<Booking[]>([])
    // const [orders, setOrders] = useState<OrderDetails[]>([]);

    useAuthEffect(() => {
        GetWaiterBookings().then(setBookings);
        // GetWaiterOrdersDetails().then(setOrders);
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.title__container}>
                <h1 className={styles.title}>Брони и заказы</h1>
            </div>
            <div className={styles.bookings__container}>
                {bookings.map(booking =>
                    <BookingCard key={booking.id} booking={booking} deleteBooking={() => {
                        ConfirmBooking(booking.id);
                    }}/>
                )}
                {/*{orders.map(order =>*/}
                {/*    <div key={order.orderDetailsId} className={styles.booking}>*/}
                {/*        <h2>Тип:</h2> <h2>Заказ</h2>*/}
                {/*        <p>Итоговая сумма:</p> <p>{order.totalAmount}</p>*/}
                {/*        <div>*/}
                {/*            <p>Состав:</p>*/}
                {/*            {order.orders.map((order, index) =>*/}
                {/*                <p key={index}>{order.foodName} ×{order.quantity} ({order.totalPrice}₽)</p>*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*        <button onClick={() => {*/}
                {/*            ConfirmOrder(order.orderDetailsId)*/}
                {/*                .then(details => {*/}
                {/*                    setOrders(orders.map(o => o.orderDetailsId === order.orderDetailsId ? details : o));*/}
                {/*                });*/}
                {/*        }} disabled={order.status === 'CONFIRMED'}>*/}
                {/*            {order.status === 'CONFIRMED' ? 'Бронь уже подтверждена' : 'Подтвердить бронь'}*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </main>
    )
}

function BookingCard({booking, deleteBooking}: { booking: Booking, deleteBooking: () => void }) {
    const [orders, setOrders] = useState<Order[]>([]);

    return (
        <div key={booking.id} className={styles.booking}>
            <h2>Тип:</h2> <h2>Бронирование</h2>
            <p>Владелец брони:</p> <p>{booking.userName}</p>
            <p>Расположение стола:</p> <p>{booking.deskLocation}</p>
            <p>Дата начала:</p> <p> {booking.startDate.toLocaleDateString()}</p>
            <p>Дата конца:</p> <p> {booking.endDate.toLocaleDateString()}</p>
            <p>Статус:</p> <p> {booking.status}</p>
            {orders.length > 0 && <div><h3>Ваш заказ:</h3>
                {orders.map((order, index) => <p
                    key={index}>{order.foodName} ×{order.quantity} ({order.totalPrice}₽)</p>)}</div>}
            <button onClick={deleteBooking} disabled={booking.status === 'CONFIRMED'}>
                {booking.status === 'CONFIRMED' ? 'Бронь уже подтверждена' : 'Подтвердить бронь'}
            </button>
        </div>
    )
}