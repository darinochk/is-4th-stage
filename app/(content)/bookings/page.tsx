'use client'
import styles from "./page.module.css";
import {useRef, useState} from "react";
import {Booking, DeleteBooking, GetAdminBookings, GetBookings, GetBookingsByDesk} from "@/api/booking";
import {useAuthEffect} from "@/api/auth";
import {UserChooser} from "@/app/components/user-chooser";
import {DeskChooser} from "@/app/components/desk-chooser";
import {useUserStore} from "@/context/user-store";
import {ConfirmOrder, Order, StartOrder} from "@/api/order";
import FoodOrderPopup from "@/app/components/food-order-popup";
import {CreateFood, DeleteFood, Food, GetFood, UpdateFood} from "@/api/food";
import FoodChangePopup from "@/app/components/food-change-popup";
import {Message} from "@/api/api";

export default function Page() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [anyDesk, setAnyDesk] = useState<{ deskNumber: number, id: number | 'all' }>({deskNumber: -1, id: -1});
    const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");
    const [food, setFood] = useState<Food[]>([]);
    const foodDialogRef = useRef<HTMLDialogElement>(null);

    useAuthEffect(() => {
        GetFood().then(setFood);
    }, []);

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
            <div>
                <div className={styles.title__container}>
                    {isAdmin && <DeskChooser setDeskAction={setAnyDesk}/>}
                    <h1 className={styles.title}>{anyDesk.id === 'all' ? "Все бронирования" : anyDesk.id < 0 ? "Ваши бронирования" : "Бронирования на столик " + anyDesk.deskNumber}</h1>
                </div>
                <div className={styles.bookings__container}>
                    {bookings.map(booking =>
                        <BookingCard key={booking.id} booking={booking} deleteBooking={() => {
                            DeleteBooking(booking.id);
                            setBookings(bookings.filter(e => e.id !== booking.id))
                        }}/>
                    )}
                </div>
            </div>
            <div>
                <div className={styles.title__container}>
                    <h1 className={styles.title}>Еда</h1>
                </div>
                <div className={styles.bookings__container} style={{flexDirection: 'column'}}>
                    {isAdmin && <button onClick={() => foodDialogRef.current?.showModal()}>Добавить еду</button>}
                    <FoodChangePopup ref={foodDialogRef} food={{} as Food} setFood={newFood => {
                        let resolve: (mess: Message) => void = () => {
                        };
                        const setMessage = new Promise((res: (mess: Message) => void) => {
                            resolve = res;
                        })

                        CreateFood(newFood, resolve)
                            .then(newFood => {
                                if (newFood) {
                                    setFood([...food, newFood]);
                                    foodDialogRef.current?.close();
                                }
                            })

                        return setMessage;
                    }}/>
                    {food.map((fd, i) =>
                        <FoodCard key={i} food={fd} onChange={newFood => {
                            if (newFood) {
                                setFood(food.map(e => e.id === fd.id ? newFood : e));
                            } else {
                                setFood(food.filter(e => e.id !== fd.id));
                            }
                        }}/>
                    )}
                </div>
            </div>
        </main>
    )
}

function BookingCard({booking, deleteBooking}: { booking: Booking, deleteBooking: () => void }) {
    const [orderDetails, setOrderDetails] = useState<number>(-1);
    const [orders, setOrders] = useState<Order[]>([]);
    const orderRef = useRef<HTMLDialogElement>(null);

    return (
        <div key={booking.id} className={styles.booking}>
            <h2>Владелец брони:</h2> <h2>{booking.userName}</h2>
            <p>Расположение стола:</p> <p>{booking.deskLocation}</p>
            <p>Дата начала:</p> <p> {booking.startDate.toLocaleDateString()}</p>
            <p>Дата конца:</p> <p> {booking.endDate.toLocaleDateString()}</p>
            <p>Статус:</p> <p> {booking.status}</p>
            {orders.length > 0 && <div><h3>Ваш заказ:</h3>
                {orders.map((order, index) => <p
                    key={index}>{order.foodName} ×{order.quantity} ({order.totalPrice}₽)</p>)}</div>}
            <button onClick={() => {
                if (orderDetails < 1) {
                    StartOrder(booking.id)
                        .then(id => {
                            if (id > 0) {
                                setOrderDetails(id);
                                orderRef.current?.showModal();
                            }
                        });
                } else
                    orderRef.current?.showModal();
            }}>{orderDetails == -2 ? 'Ваш заказ сделан, заказать ещё?' : 'Добавить еды'}
            </button>
            {orders.length > 0 && orderDetails > -1 && <button onClick={() => {
                ConfirmOrder(orderDetails)
                    .then(orders => {
                        setOrders(orders.orders);
                        setOrderDetails(-2);
                    });
            }}>Подтвердить еду
            </button>}
            <button onClick={deleteBooking}>Отменить бронь
            </button>
            <FoodOrderPopup orderDetails={orderDetails} ref={orderRef}
                            onOrder={order => setOrders([...orders, order])}/>
        </div>
    )
}

function FoodCard({food, onChange}: { food: Food, onChange: (food: Food | null) => void }) {
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
                    <button onClick={() => {
                        DeleteFood(food.id)
                            .then(() => onChange(null));
                    }}>Удалить</button>
                </>
            )}
            <FoodChangePopup food={food} setFood={updatedFood => {
                return new Promise((resolve) => {
                    UpdateFood(food.id, updatedFood, resolve).then(fd => {
                        if (fd) {
                            onChange(fd);
                        }
                    });
                });
            }} ref={dialogRef} />
        </div>
    )
}