"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { Booking, Order } from "@/app/services/api";
import { useAuthEffect } from "@/app/hooks/use-auth-effect";
import { waiterService } from "@/app/services/api";

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useAuthEffect(() => {
    waiterService.getWaiterBookings().then(setBookings);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.title__container}>
        <h1 className={styles.title}>Брони и заказы</h1>
      </div>
      <div className={styles.bookings__container}>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            deleteBooking={() => {
              waiterService.confirmBooking(booking.id);
            }}
          />
        ))}
      </div>
    </main>
  );
}

function BookingCard({ booking, deleteBooking }: { booking: Booking; deleteBooking: () => void }) {
  const [orders] = useState<Order[]>([]);

  return (
    <div key={booking.id} className={styles.booking}>
      <h2>Тип:</h2> <h2>Бронирование</h2>
      <p>Владелец брони:</p> <p>{booking.userName}</p>
      <p>Расположение стола:</p> <p>{booking.deskLocation}</p>
      <p>Дата начала:</p> <p> {booking.startDate.toLocaleDateString()}</p>
      <p>Дата конца:</p> <p> {booking.endDate.toLocaleDateString()}</p>
      <p>Статус:</p> <p> {booking.status}</p>
      {orders.length > 0 && (
        <div>
          <h3>Ваш заказ:</h3>
          {orders.map((order, index) => (
            <p key={index}>
              {order.foodName} ×{order.quantity} ({order.totalPrice}₽)
            </p>
          ))}
        </div>
      )}
      <button onClick={deleteBooking} disabled={booking.status === "CONFIRMED"}>
        {booking.status === "CONFIRMED" ? "Бронь уже подтверждена" : "Подтвердить бронь"}
      </button>
    </div>
  );
}
