'use client'
import {IntUser, Role, useUserStore} from "@/context/user-store";
import {useRef, useState} from "react";
import {AdminDeleteUser, AdminSetUserRole, AdminUpdateUser, GetUsers, UpdateUser, useAuthEffect} from "@/api/auth";
import styles from "../page.module.css";
import UserChangePopup from "@/app/components/user-change-popup";
import {Message} from "@/api/api";


export default function Page() {
    const [users, setUsers] = useState<IntUser[]>([]);

    useAuthEffect(() => {
        GetUsers().then(setUsers);
    }, []);

    return (
        <div>
            <h1 className={styles.title}>Пользователи</h1>
            <div className={styles.desks__container}>
                {users.map((user, index) =>
                    <UserCard user={user} onChange={newUser => {
                        if (newUser) {
                            setUsers(users.map(e => e.id === newUser.id ? newUser : e));
                        } else {
                            setUsers(users.filter(e => e.id !== user.id));
                            AdminDeleteUser(user.id);
                        }
                    }} key={index}/>)}
            </div>
        </div>
    );
}


function UserCard({user, onChange}: { user: IntUser, onChange: (user: IntUser | null) => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <div className={styles.desk} style={{gridTemplateColumns: "max-content 1fr"}}>
            <h3>Имя: </h3> <h3>{user.firstName} {user.id === useUserStore.getState().user?.id ? "(Вы)" : ""}</h3>
            <h3>Фамилия: </h3> <h3>{user.lastName}</h3>
            <p>Телефон:</p><p>{user.phone}</p>
            <p>Адрес:</p><p>{user.address}</p>
            <p>Почта:</p><p>{user.email}</p>
            <p>Роль:</p>
            <select value={user.role} disabled={user.id === useUserStore.getState().user?.id}
                    onChange={e => {
                        const select = e.currentTarget;
                        select.disabled = true;
                        AdminSetUserRole(user.id, e.target.value as Role, () => {
                        }).then(user => {
                            select.disabled = false;
                            if (user)
                                onChange(user);
                        })
                    }}>
                {Object.values(Role).map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button onClick={() => dialogRef.current?.showModal()}>Изменить</button>
            <button onClick={() => {
                onChange(null)
            }}>Отчислить
            </button>
            <UserChangePopup user={user} ref={dialogRef} setUser={us => {
                let resolve: (mess: Message) => void = () => {
                };
                const setMessage = new Promise((res: (mess: Message) => void) => {
                    resolve = res;
                })

                AdminUpdateUser(user.id, us, resolve).then(newUser => {
                    if (newUser) {
                        if (useUserStore.getState().user?.id === user.id) {
                            useUserStore.getState().Login(newUser, useUserStore.getState().token!);
                        }
                        onChange(newUser);
                    }
                })

                return setMessage;
            }}/>
        </div>
    )
}