'use client'
import "./user-chooser.css";
import {useEffect, useState} from "react";
import {IntUser, useUserStore} from "@/context/user-store";
import {GetUsers} from "@/api/auth";

export function UserChooser({setUserAction}: { setUserAction: ({email, id}: { email: string, id: number }) => void }) {
    const [users, setUsers] = useState<IntUser[]>([]);
    const [username, setUsername] = useState('');
    const inited = useUserStore((state) => state.inited);

    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (inited) GetUsers().then(setUsers);
    }, [inited]);

    useEffect(() => {
        if(!username) setUserAction({email: '', id: -1});
    }, [username]);

    return (
        <div className="chooser">
            <input type="text" onFocus={() => setFocused(true)} placeholder="Профиль рользователя..."
                   value={username} onBlur={() => setTimeout(() => setFocused(false), 100)}
                   onChange={e => setUsername(e.target.value)}/>
            <div style={{position: 'relative', width: '100%'}}>
                <div style={{position: 'absolute', top: '0', left: 0}} className="chooser__list">
                    {focused && users.filter(e => e.email.startsWith(username)).map(u =>
                        <div key={u.id}
                             onClick={() => {
                                 setUserAction(u);
                                 setUsername(u.email);
                             }}>{u.email}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}