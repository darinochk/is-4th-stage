'use client'
import styles from "./page.module.css";
import {FocusEventHandler, useState} from "react";
import {CreateDesk, Desk, GetDesks} from "@/api/desks";
import {useAuthEffect} from "@/api/auth";
import {useUserStore} from "@/context/user-store";
import MessageComponent from "@/app/components/message";
import Spinner from "@/app/components/spinner";
import {Message} from "@/api/api";

export default function Home() {
    const [desks, setDesks] = useState<Desk[]>([]);
    const inited = useUserStore((state) => state.inited);
    const isAdmin = useUserStore((state) => state.user?.role === 'ADMIN');

    const [writing, setWriting] = useState(false);
    const [closingTimeout, setClosingTimeout] = useState<NodeJS.Timeout>(setTimeout(() => {
    }, 0));

    const [response, setResponse] = useState<Message | null>(null)
    const [requestSent, setRequestSent] = useState<boolean>(false);

    useAuthEffect(() => {
        GetDesks().then(setDesks);
    }, []);

    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
        if (!e.currentTarget.value)
            setClosingTimeout(setTimeout(() => setWriting(false), 100));
    }

    const handleFocus = () => {
        setWriting(true);
        clearTimeout(closingTimeout);
    }

    return (
        <div>
            {inited && isAdmin &&
                <form className={styles.write_desk + ' ' + (writing ? '' : styles.collapsed)}
                      onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const form = e.currentTarget;
                          CreateDesk(Object.fromEntries(formData), setResponse)
                              .then(post => {
                                  if (post) {
                                      setDesks([...desks, post]);
                                      form.reset();
                                      setWriting(false);
                                      setResponse(null);
                                  }
                              })
                      }}>
                    <input type="text" className={styles.text} name="location" maxLength={256} required
                           placeholder="Где находится новый столик?"
                           onFocus={handleFocus}
                           onBlur={handleBlur}
                    />
                    <label>Номер столика:
                        <input type="number" className={styles.text} name="deskNumber" min={1} required
                               onFocus={handleFocus}
                               onBlur={handleBlur}
                        />
                    </label>
                    <label>Вместимость столика:
                        <input type="number" className={styles.text} name="capacity" min={1} required
                               onFocus={handleFocus}
                               onBlur={handleBlur}
                        />
                    </label>
                    <MessageComponent message={response}/>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <button className={styles.publish} disabled={requestSent}>{requestSent &&
                            <Spinner size={30} style={{margin: "-11px 0 -11px -32px", paddingRight: "32px"}}/>}Добавить столик
                        </button>
                    </div>
                </form>}
            {desks.map(e => <DeskCard key={e.id} card={e}/>)}
        </div>
    );
}



function DeskCard({card}: { card: Desk }) {

    return (
        <div>
            <h3>Столик номер: {card.deskNumber}</h3>
            <p>Вместимость: {card.capacity}</p>
            <p>Расположение: {card.location}</p>
        </div>
    )
}