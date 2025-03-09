'use client'
import Link from "next/link";
import "./header.css";
import {usePathname, useRouter} from "next/navigation";
import {useUserStore} from "@/context/user-store";
import Logo from "@/app/components/logo";
import {useRef, useState} from "react";


interface NavigationRoute {
    path: string;
    isAdmin: boolean;
}

const route = (path: string, isAdmin: boolean = false): NavigationRoute => {
    return {path: path, isAdmin: isAdmin};
};

const NAVIGATION_ROUTES: { [key: string]: NavigationRoute } = {
    "Столики": route('/'),
    "Бронирования": route('/bookings'),
    "Отзывы": route('/review'),
}

export default function Header() {
    const [showComboBox, setShowComboBox] = useState(false);
    const isAdmin = useUserStore(state => state.user?.role == "ADMIN");
    const name = useUserStore(state => state.user?.firstName);
    const path = usePathname();
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);


    return (
        <header className="header">
            <a href='/' style={{marginRight: 'auto'}}><h1><Logo/></h1></a>
            {Object.keys(NAVIGATION_ROUTES).filter(e => !NAVIGATION_ROUTES[e].isAdmin || NAVIGATION_ROUTES[e].isAdmin == isAdmin).map((key, index) =>
                <Link className={"header-link" + (path == NAVIGATION_ROUTES[key].path ? " disabled" : "")}
                      href={NAVIGATION_ROUTES[key].path}
                      key={index}>
                    {key}
                </Link>
            )}
            <div className='profile'>
                {showComboBox && <div className='combo-box'>
                    <button onClick={() => {
                        if (dialogRef.current) dialogRef.current.showModal();
                    }}>Изменить данные
                    </button>
                    <button onClick={() => {
                        useUserStore.getState().Logout();
                        router.push('/login');
                    }}>Выйти
                    </button>
                </div>}
                <div onClick={() => setShowComboBox(!showComboBox)} style={{cursor: 'pointer'}}>
                    <svg width="25px" height="25px" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {name}
                </div>
            </div>
            <dialog ref={dialogRef}>
                <form method='dialog'>
                    <h3>Мы отправили ссылку для сброса пароля вам на почту</h3>
                    <button className='ok_button'>Понятно</button>
                </form>
            </dialog>
        </header>
    )
}