"use client";
import styles from "./page.module.css";
import { FocusEventHandler, useState, useRef } from "react";
import { Desk } from "@/app/services/api";
import { deskService } from "@/app/services/api";
import { useAuthEffect } from "@/app/hooks/use-auth-effect";
import { useUserStore } from "@/context/user-store";
import MessageComponent from "@/app/components/message";
import Spinner from "@/app/components/spinner";
import { ApiMessage } from "@/app/services/http";
import { DeskCard } from "@/app/components/desk-card";

export default function Home() {
  const [desks, setDesks] = useState<Desk[]>([]);
  const inited = useUserStore((state) => state.inited);
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");

  const [writing, setWriting] = useState(false);
  const closingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [response, setResponse] = useState<ApiMessage | null>(null);
  const [requestSent] = useState<boolean>(false);

  useAuthEffect(() => {
    deskService.getDesks().then(setDesks);
  }, []);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    if (!e.currentTarget.value) {
      if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);
      closingTimeoutRef.current = setTimeout(() => setWriting(false), 100);
    }
  };

  const handleFocus = () => {
    setWriting(true);
    if (closingTimeoutRef.current) {
      clearTimeout(closingTimeoutRef.current);
      closingTimeoutRef.current = null;
    }
  };

  return (
    <div>
      {inited && isAdmin && (
        <form
          className={styles.write_desk + " " + (writing ? "" : styles.collapsed)}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const form = e.currentTarget;
            deskService.createDesk(Object.fromEntries(formData), setResponse).then((post) => {
              if (post) {
                setDesks([...desks, post]);
                form.reset();
                setWriting(false);
                setResponse(null);
              }
            });
          }}
        >
          <input
            type="text"
            className={styles.text}
            name="location"
            maxLength={256}
            required
            placeholder="Где находится новый столик?"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <label>
            Номер столика:
            <input
              type="number"
              className={styles.text}
              name="deskNumber"
              min={1}
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label>
            Вместимость столика:
            <input
              type="number"
              className={styles.text}
              name="capacity"
              min={1}
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <MessageComponent message={response} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className={styles.publish} disabled={requestSent}>
              {requestSent && (
                <Spinner
                  size={30}
                  style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }}
                />
              )}
              Добавить столик
            </button>
          </div>
        </form>
      )}
      <div className={styles.desks__container}>
        {desks.map((e) => (
          <DeskCard
            key={e.id}
            card={e}
            onCardChange={(desk) => {
              if (desk) setDesks(desks.map((e) => (e.id === desk.id ? desk : e)));
              else setDesks(desks.filter((e1) => e.id !== e1.id));
            }}
          />
        ))}
      </div>
    </div>
  );
}
