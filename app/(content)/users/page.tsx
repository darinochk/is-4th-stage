'use client'
import {IntUser, useUserStore} from "@/context/user-store";
import {useState} from "react";
import {GetUsers, useAuthEffect} from "@/api/auth";
import styles from "../page.module.css";


export default function Page() {
    const [users, setUsers] = useState<IntUser[]>([]);

    useAuthEffect(() => {
        GetUsers().then(setUsers);
    }, []);

    return (
        <div>
            <h1>Пользователи</h1>
            <div className={styles.desks__container}>
                {users.map((user, index) =>
                    <div key={index} className={styles.desk} style={{gridTemplateColumns: "max-content 1fr"}}>
                    <h3>Имя: </h3> <h3>{user.firstName} {user.id === useUserStore.getState().user?.id ? "(Вы)" : ""}</h3>
                    <h3>Фамилия: </h3> <h3>{user.lastName}</h3>
                    <p>Телефон:</p><p>{user.phone}</p>
                    <p>Адрес:</p><p>{user.address}</p>
                    <p>Почта:</p><p>{user.email}</p>
                    <p>Роль:</p><p>{user.role}</p>
                    <button>Изменить</button>
                    <button>Отчислить</button>
                </div>)}
            </div>
        </div>
    );
}