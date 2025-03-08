'use client'
import styles from "./page.module.css";
import {useState} from "react";
import {Booking, DeleteBooking, GetAdminBookings, GetBookings, GetBookingsByDesk} from "@/api/booking";
import {useAuthEffect} from "@/api/auth";
import {UserChooser} from "@/app/components/user-chooser";
import {DeskChooser} from "@/app/components/desk-chooser";
import {useUserStore} from "@/context/user-store";

export default function Page() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [anyDesk, setAnyDesk] = useState<{ deskNumber: number, id: number | 'all' }>({deskNumber: -1, id: -1});
    const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");

    useAuthEffect(() => {
        if (anyDesk.id === 'all')
            GetAdminBookings().then(setBookings);
        else if (anyDesk.id < 0)
            GetBookings().then(setBookings);
        else
            GetBookingsByDesk(anyDesk.id).then(setBookings);
    }, [anyDesk]);

    return (
        <main className={styles.main}>
            <div className={styles.title__container}>
                {isAdmin && <DeskChooser setDeskAction={setAnyDesk}/>}
                <h1 className={styles.title}>{anyDesk.id === 'all' ? "Все бронирования" : anyDesk.id < 0 ? "Ваши бронирования" : "Бронирования на столик " + anyDesk.deskNumber}</h1>
            </div>
            <div className={styles.bookings__container}>
                {bookings.map(booking =>
                    <div key={booking.id} className={styles.booking}>
                        <h2>Владелец брони:</h2> <h2>{booking.userName}</h2>
                        <p>Расположение стола:</p> <p>{booking.deskLocation}</p>
                        <p>Дата начала:</p> <p> {booking.startDate.toLocaleDateString()}</p>
                        <p>Дата конца:</p> <p> {booking.endDate.toLocaleDateString()}</p>
                        <p>Статус:</p> <p> {booking.status}</p>
                        <button onClick={() => {
                            DeleteBooking(booking.id);
                            setBookings(bookings.filter(e => e.id !== booking.id))
                        }}>Отменить бронь
                        </button>
                    </div>)}
            </div>
        </main>
    )
}