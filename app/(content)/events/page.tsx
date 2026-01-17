"use client";
import EventChangePopup from "@/app/components/event-change-popup";
import { Message } from "@/api/api";
import {
  CoffeeEvent,
  CreateEvent,
  CreatePromotion,
  DeleteEvent,
  GetAllEvents,
  GetAllPromotions,
  Promotion,
  UpdateEvent,
} from "@/api/events-promotions";
import { FocusEventHandler, useRef, useState } from "react";
import styles from "../page.module.css";
import { useAuthEffect } from "@/api/auth";
import Spinner from "@/app/components/spinner";
import MessageComponent from "@/app/components/message";
import { useUserStore } from "@/context/user-store";

export default function Page() {
  const [events, setEvents] = useState<(CoffeeEvent & { event?: boolean })[]>([]);
  const [promotions, setPromotions] = useState<(Promotion & { event?: boolean })[]>([]);
  const [writing, setWriting] = useState(false);
  const [closingTimeout, setClosingTimeout] = useState<NodeJS.Timeout>(setTimeout(() => {}, 0));

  const [response, setResponse] = useState<Message | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const inited = useUserStore((state) => state.inited);
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");

  useAuthEffect(() => {
    GetAllEvents().then(setEvents);
    GetAllPromotions().then(setPromotions);
  }, []);

  const handleBlur: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => {
    if (!e.currentTarget.value) setClosingTimeout(setTimeout(() => setWriting(false), 100));
  };

  const handleFocus = () => {
    setWriting(true);
    clearTimeout(closingTimeout);
  };

  return (
    <div>
      <h1 className={styles.title}>События и акции</h1>
      {inited && isAdmin && (
        <form
          className={styles.write_desk + " " + (writing ? "" : styles.collapsed)}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const form = e.currentTarget;

            const eventData = {
              name: formData.get("name"),
              description: formData.get("description"),
              startDate: formData.get("startDate"),
              endDate: formData.get("endDate"),
            };

            const selectedType = formData.get("eventType");
            const createFunction = selectedType === "promotion" ? CreatePromotion : CreateEvent;

            createFunction(eventData, setResponse).then((post) => {
              if (post) {
                setEvents([...events, post]);
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
            name="name"
            maxLength={256}
            required
            placeholder="Введите название события"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <label>
            Тип:
            <select name="eventType" required onFocus={handleFocus} onBlur={handleBlur}>
              <option value="event">Событие</option>
              <option value="promotion">Акция</option>
            </select>
          </label>
          <label>
            Описание события:
            <textarea
              className={styles.text}
              name="description"
              required
              placeholder="Введите описание события"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label>
            Дата начала:
            <input
              type="date"
              className={styles.text}
              name="startDate"
              required
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label>
            Дата окончания:
            <input
              type="date"
              className={styles.text}
              name="endDate"
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
              Добавить событие
            </button>
          </div>
        </form>
      )}
      <div className={styles.desks__container}>
        {events
          .map((e) => ((e.event = true), e))
          .concat(promotions)
          .map((event, index) => (
            <EventCard
              isEvent={event.event === true}
              key={index}
              event={event}
              onChange={(newEvent) => {
                if (newEvent) {
                  setEvents(events.map((e) => (e.id === newEvent.id ? newEvent : e)));
                } else {
                  setEvents(events.filter((e) => e.id !== event.id));
                  DeleteEvent(event.id);
                }
              }}
            />
          ))}
      </div>
    </div>
  );
}

function EventCard({
  event,
  onChange,
  isEvent,
}: {
  event: CoffeeEvent;
  onChange: (event: CoffeeEvent | null) => void;
  isEvent: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");

  return (
    <div className={styles.desk} style={{ gridTemplateColumns: "max-content 1fr" }}>
      <h2 style={{ gridColumn: "span 2", textAlign: "center" }}>{isEvent ? "Событие" : "Акция"}</h2>
      <h3>Название: </h3> <h3>{event.name}</h3>
      <p>Описание: </p> <p>{event.description}</p>
      <p>Дата начала:</p>
      <p>{new Date(event.startDate).toLocaleDateString()}</p>
      <p>Дата окончания:</p>
      <p>{new Date(event.endDate).toLocaleDateString()}</p>
      {isAdmin && (
        <>
          <button onClick={() => dialogRef.current?.showModal()}>Изменить</button>
          <button
            onClick={() => {
              onChange(null);
            }}
          >
            Удалить
          </button>
        </>
      )}
      <EventChangePopup
        event={event}
        ref={dialogRef}
        setEvent={(ev) => {
          let resolve: (mess: Message) => void = () => {};
          const setMessage = new Promise((res: (mess: Message) => void) => {
            resolve = res;
          });

          UpdateEvent(event.id, ev, resolve).then((newEvent) => {
            if (newEvent) {
              onChange(newEvent);
            }
          });

          return setMessage;
        }}
      />
    </div>
  );
}
