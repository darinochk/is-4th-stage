"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import {
  Booking,
  DeleteBooking,
  GetAdminBookings,
  GetBookings,
  GetBookingsByDesk,
} from "@/api/booking";
import { useAuthEffect } from "@/api/auth";
import { DeskChooser } from "@/app/components/desk-chooser";
import { useUserStore } from "@/context/user-store";
import {
  ConfirmOrder,
  GetOrderByBooking,
  Order,
  RemoveFoodFromOrder,
  StartOrder,
} from "@/api/order";
import FoodOrderPopup from "@/app/components/food-order-popup";
import { CreateFood, DeleteFood, Food, GetFood, UpdateFood } from "@/api/food";
import FoodChangePopup from "@/app/components/food-change-popup";
import { Message } from "@/api/api";
import { InitPayment, Payment } from "@/api/payment";
import PaymentPopup from "@/app/components/payment-popup";

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
    GetFood().then(setFood);
  }, []);

  useAuthEffect(() => {
    if (selectedDesk.id === "all") GetAdminBookings().then(setBookings);
    else if (selectedDesk.id < 0) GetBookings().then(setBookings);
    else GetBookingsByDesk(selectedDesk.id).then(setBookings);
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
                DeleteBooking(booking.id);
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
              let resolve: (mess: Message) => void = () => {};
              const setMessage = new Promise((res: (mess: Message) => void) => {
                resolve = res;
              });

              CreateFood(newFood, resolve).then((newFood) => {
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

function BookingCard({
  booking,
  onDeleteBooking,
}: {
  booking: Booking;
  onDeleteBooking: () => void;
}) {
  const [orderDetails, setOrderDetails] = useState<number>(-1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<Order[]>([]);
  const orderRef = useRef<HTMLDialogElement>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const payRef = useRef<HTMLDialogElement>(null);

  const hasUnconfirmedChanges =
    orders.length !== confirmedOrders.length ||
    orders.some((order, index) => order.id !== confirmedOrders[index]?.id);

  useAuthEffect(() => {
    GetOrderByBooking(booking.id).then((details) => {
      setOrderDetails(details?.orderDetailsId || -1);
      const initialOrders = details?.orders || [];
      setOrders(initialOrders);
      setConfirmedOrders(initialOrders);
    });
  }, []);

  return (
    <div key={booking.id} className={styles.booking}>
      <h2>Владелец брони:</h2> <h2>{booking.userName}</h2>
      <p>Расположение стола:</p> <p>{booking.deskLocation}</p>
      <p>Дата начала:</p> <p> {booking.startDate.toLocaleDateString()}</p>
      <p>Дата конца:</p> <p> {booking.endDate.toLocaleDateString()}</p>
      <p>Статус:</p> <p> {booking.status}</p>
      <p>Цена:</p> <p> {orders.reduce((acc, e) => acc + e.totalPrice, 0)}₽</p>
      {orders.length > 0 && (
        <div>
          <h3>Ваш заказ:</h3>
          {orders.map((order, index) => (
            <p
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => {
                RemoveFoodFromOrder(order.id).then(() => {
                  setOrders(orders.filter((e) => e.id !== order.id));
                });
              }}
            >
              {order.foodName} ×{order.quantity} ({order.totalPrice}₽)
            </p>
          ))}
        </div>
      )}
      <button
        disabled={payment?.transaction?.status === "SUCCESS"}
        onClick={() => {
          if (orderDetails < 1) {
            StartOrder(booking.id).then((id) => {
              if (id > 0) {
                setOrderDetails(id);
                orderRef.current?.showModal();
              }
            });
          } else orderRef.current?.showModal();
        }}
      >
        {payment?.transaction?.status === "SUCCESS" ? "Вы уже оплатили заказ" : "Добавить еды"}
      </button>
      {orders.length > 0 && orderDetails > -1 && (
        <button
          disabled={payment?.transaction?.status === "SUCCESS"}
          onClick={() => {
            if (hasUnconfirmedChanges) {
              ConfirmOrder(orderDetails).then((orderDetails) => {
                if (orderDetails) {
                  const confirmed = orderDetails.orders;
                  setOrders(confirmed);
                  setConfirmedOrders(confirmed);
                }
              });
            } else {
              if (payment) payRef.current?.showModal();
              else
                InitPayment(orderDetails).then((pay) => {
                  setPayment(pay);
                  setTimeout(() => payRef.current?.showModal(), 20);
                });
            }
          }}
        >
          {hasUnconfirmedChanges
            ? "Подтвердить еду"
            : payment?.transaction?.status === "SUCCESS"
              ? "Оплачено"
              : "Оплатить"}
        </button>
      )}
      <button onClick={onDeleteBooking}>Отменить бронь</button>
      {payment && (
        <PaymentPopup
          ref={payRef}
          payment={payment}
          setPayment={(paym) => {
            setPayment(paym);
            if (paym?.transaction?.status === "SUCCESS")
              setTimeout(() => payRef.current?.close(), 1500);
          }}
        />
      )}
      <FoodOrderPopup
        orderDetails={orderDetails}
        ref={orderRef}
        onOrder={(order) => setOrders([...orders, order])}
      />
    </div>
  );
}

function FoodCard({
  food,
  onFoodChange,
}: {
  food: Food;
  onFoodChange: (food: Food | null) => void;
}) {
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div key={food.id} className={styles.booking}>
      <h2>Название:</h2> <h2>{food.name}</h2>
      <p>Тип:</p> <p>{food.foodType}</p>
      <p>Цена:</p> <p>{food.price}₽</p>
      {isAdmin && (
        <>
          <button onClick={() => dialogRef.current?.showModal()}>Изменить</button>
          <button
            onClick={() => {
              DeleteFood(food.id).then(() => onFoodChange(null));
            }}
          >
            Удалить
          </button>
        </>
      )}
      <FoodChangePopup
        food={food}
        setFood={(updatedFood) => {
          return new Promise((resolve) => {
            UpdateFood(food.id, updatedFood, resolve).then((fd) => {
              if (fd) {
                onFoodChange(fd);
              }
            });
          });
        }}
        ref={dialogRef}
      />
    </div>
  );
}
