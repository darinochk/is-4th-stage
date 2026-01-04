import { useRef, useState, useEffect } from "react";
import { Desk } from "@/app/services/api";
import { deskService, bookingService } from "@/app/services/api";
import { useUserStore } from "@/context/user-store";
import { useRouter } from "next/navigation";
import { ApiMessage } from "@/app/services/http";
import MessageComponent from "@/app/components/message";
import Spinner from "@/app/components/spinner";
import styles from "@/app/(content)/page.module.css";

interface DeskCardProps {
  card: Desk;
  onCardChange: (card: Desk | null) => void;
}

export function DeskCard({ card, onCardChange }: DeskCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [response, setResponse] = useState<ApiMessage | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");
  const editDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (response?.isError === false) router.push("/bookings");
  }, [response, router]);

  return (
    <div className={styles.desk}>
      <h3>Столик номер: {card.deskNumber}</h3>
      <p>Вместимость: {card.capacity}</p>
      <p>Расположение: {card.location}</p>
      <button
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Забронировать
      </button>
      {isAdmin && (
        <button
          onClick={() => {
            editDialogRef.current?.showModal();
          }}
        >
          Изменить
        </button>
      )}
      {isAdmin && (
        <button
          onClick={() => {
            deskService.deleteDesk(card.id).then(() => {
              onCardChange(null);
            });
          }}
        >
          Удалить
        </button>
      )}
      <dialog
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "DIALOG" && e.target === e.currentTarget)
            dialogRef.current?.close();
        }}
        ref={dialogRef}
      >
        <form
          method="dialog"
          onSubmit={(e) => {
            e.preventDefault();
            bookingService.createBooking(
              Object.fromEntries(new FormData(e.currentTarget)),
              setResponse
            );
          }}
        >
          <h3>Бронирование столика {card.deskNumber}</h3>
          <input type="hidden" value={card.id} name="deskId" />
          <input type="hidden" value="initial" name="status" />
          <label>
            Дата начала:
            <input
              type="date"
              className={styles.text}
              onChange={(e) => setStartDate(e.currentTarget.value)}
              defaultValue={new Date().toISOString().substring(0, 10)}
              name="startDate"
              min={new Date().toISOString().substring(0, 10)}
              required
            />
          </label>
          <label>
            Дата конца:
            <input
              type="date"
              className={styles.text}
              defaultValue={new Date().toISOString().substring(0, 10)}
              name="endDate"
              min={startDate}
              required
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
              Забронировать столик
            </button>
          </div>
        </form>
      </dialog>
      {isAdmin && (
        <dialog
          ref={editDialogRef}
          onClose={() => {
            setResponse(null);
            setRequestSent(false);
          }}
        >
          <form
            className={styles.write_desk}
            method="dialog"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const form = e.currentTarget;
              deskService.updateDesk(card.id, Object.fromEntries(formData)).then((desk) => {
                if (desk) {
                  onCardChange(desk);
                  form.reset();
                  setResponse(null);
                  setRequestSent(false);
                  editDialogRef.current?.close();
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
              placeholder="Где находится столик?"
              defaultValue={card.location}
            />
            <label>
              Номер столика:
              <input
                type="number"
                className={styles.text}
                name="deskNumber"
                min={1}
                required
                defaultValue={card.deskNumber}
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
                defaultValue={card.capacity}
              />
            </label>
            <MessageComponent message={response} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className={styles.publish}
                disabled={requestSent}
                onClick={(e) => {
                  e.preventDefault();
                  editDialogRef.current?.close();
                }}
              >
                Закрыть
              </button>
              <button className={styles.publish} disabled={requestSent}>
                {requestSent && (
                  <Spinner
                    size={30}
                    style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }}
                  />
                )}
                Сохранить столик
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
