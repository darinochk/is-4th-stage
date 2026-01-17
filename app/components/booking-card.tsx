import { useRef, useState } from "react";
import { Booking, Order, Payment } from "@/app/services/api";
import { orderService, paymentService } from "@/app/services/api";
import { useAuthEffect } from "@/app/hooks/use-auth-effect";
import FoodOrderPopup from "@/app/components/food-order-popup";
import PaymentPopup from "@/app/components/payment-popup";
import styles from "@/app/(content)/bookings/page.module.css";

interface BookingCardProps {
  booking: Booking;
  onDeleteBooking: () => void;
}

export function BookingCard({ booking, onDeleteBooking }: BookingCardProps) {
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
    orderService.getOrderByBooking(booking.id).then((details) => {
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
                orderService.removeFoodFromOrder(order.id).then(() => {
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
            orderService.startOrder(booking.id).then((id) => {
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
              orderService.confirmOrder(orderDetails).then((orderDetails) => {
                if (orderDetails) {
                  const confirmed = orderDetails.orders;
                  setOrders(confirmed);
                  setConfirmedOrders(confirmed);
                }
              });
            } else {
              if (payment) payRef.current?.showModal();
              else
                paymentService.initPayment(orderDetails).then((pay) => {
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
