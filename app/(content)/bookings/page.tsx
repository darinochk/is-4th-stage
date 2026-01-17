"use client";
import styles from "./page.module.css";
import { useRef, useState } from "react";
import { Booking, Food } from "@/app/services/api";
import { bookingService, foodService } from "@/app/services/api";
import { useAuthEffect } from "@/app/hooks/use-auth-effect";
import { DeskChooser } from "@/app/components/desk-chooser";
import { useUserStore } from "@/context/user-store";
import FoodChangePopup from "@/app/components/food-change-popup";
import { ApiMessage } from "@/app/services/http";
import { BookingCard } from "@/app/components/booking-card";
import { FoodCard } from "@/app/components/food-card";

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<{ deskNumber: number; id: number | "all" }>({
    deskNumber: -1,
    id: -1,
  });
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");
  const [food, setFood] = useState<Food[]>([]);
  const foodDialogRef = useRef<HTMLDialogElement>(null);

  useAuthEffect(() => {
    foodService.getFood().then(setFood);
  }, []);

  useAuthEffect(() => {
    if (selectedDesk.id === "all") bookingService.getAdminBookings().then(setBookings);
    else if (selectedDesk.id < 0) bookingService.getBookings().then(setBookings);
    else bookingService.getBookingsByDesk(selectedDesk.id as number).then(setBookings);
  }, [selectedDesk]);

  return (
    <main className={styles.main}>
      <div>
        <div className={styles.title__container}>
          {isAdmin && <DeskChooser setDeskAction={setSelectedDesk} />}
          <h1 className={styles.title}>
            {selectedDesk.id === "all"
              ? "Все бронирования"
              : selectedDesk.id < 0
                ? "Ваши бронирования"
                : "Бронирования на столик " + selectedDesk.deskNumber}
          </h1>
        </div>
        <div className={styles.bookings__container}>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onDeleteBooking={() => {
                bookingService.deleteBooking(booking.id);
                setBookings(bookings.filter((e) => e.id !== booking.id));
              }}
            />
          ))}
        </div>
      </div>
      <div>
        <div className={styles.title__container}>
          <h1 className={styles.title}>Еда</h1>
        </div>
        <div className={styles.bookings__container} style={{ flexDirection: "column" }}>
          {isAdmin && (
            <button onClick={() => foodDialogRef.current?.showModal()}>Добавить еду</button>
          )}
          <FoodChangePopup
            ref={foodDialogRef}
            food={{} as Food}
            setFood={(newFood) => {
              let resolve: (mess: ApiMessage) => void = () => {};
              const setMessage = new Promise((res: (mess: ApiMessage) => void) => {
                resolve = res;
              });

              foodService.createFood(newFood, resolve).then((newFood) => {
                if (newFood) {
                  setFood([...food, newFood]);
                  foodDialogRef.current?.close();
                }
              });

              return setMessage;
            }}
          />
          {food.map((fd, i) => (
            <FoodCard
              key={i}
              food={fd}
              onFoodChange={(newFood) => {
                if (newFood) {
                  setFood(food.map((e) => (e.id === fd.id ? newFood : e)));
                } else {
                  setFood(food.filter((e) => e.id !== fd.id));
                }
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
