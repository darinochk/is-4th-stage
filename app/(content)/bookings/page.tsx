'use client'

import {useEffect, useState} from "react";
import {Booking, DeleteBooking, GetBookings} from "@/api/booking";
import {useAuthEffect} from "@/api/auth";

export default function Page() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useAuthEffect(() => {
        GetBookings().then(setBookings);
    }, []);

    return (
        <div>
            <h1>Ваши бронирования</h1>
            {bookings.map(booking =>
                <div key={booking.id}>
                    <h2>Владелец брони: {booking.userName}</h2>
                    <p>Расположение стола: {booking.deskLocation}</p>
                    <p>Дата начала: {booking.startDate.toLocaleDateString()}</p>
                    <p>Дата конца: {booking.endDate.toLocaleDateString()}</p>
                    <p>Статус: {booking.status}</p>
                    <button onClick={() => {
                        DeleteBooking(booking.id);
                        setBookings(bookings.filter(e => e.id !== booking.id))
                    }}>Отменить бронь</button>
                </div>)}
        </div>
    )
}