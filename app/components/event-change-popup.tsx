import { ApiMessage } from "@/app/services/http";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import MessageComponent from "@/app/components/message";
import styles from "@/app/(auth)/login/page.module.css";
import Spinner from "@/app/components/spinner";
import { CoffeeEvent } from "@/app/services/api";

export default forwardRef(function EventChangePopup(
  {
    event,
    setEvent,
  }: {
    event: CoffeeEvent;
    setEvent: (event: CoffeeEvent) => Promise<ApiMessage>;
  },
  ref: React.Ref<HTMLDialogElement | null>
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current!);

  const [eventInternal, setEventInternal] = useState<CoffeeEvent>(event);
  const [response, setResponse] = useState<ApiMessage | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  useEffect(() => {
    setEventInternal(event);
  }, [event]);

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventInternal({
      ...eventInternal,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === "DIALOG" && e.target === e.currentTarget)
          dialogRef.current?.close();
      }}
    >
      <form
        method="dialog"
        className={styles.form}
        style={{ marginTop: "10px" }}
        onSubmit={(e) => {
          e.preventDefault();
          setRequestSent(true);
          setResponse(null);
          setEvent(eventInternal).then((resp) => {
            if (!resp.isError) {
              dialogRef.current?.close();
            } else {
              setResponse(resp);
            }
            setRequestSent(false);
          });
        }}
      >
        <h3>Изменение события</h3>
        <label>
          Название
          <br />
          <input
            type="text"
            name="name"
            value={eventInternal?.name || ""}
            onChange={handleEventChange}
            required
          />
        </label>
        <label>
          Описание
          <br />
          <textarea
            name="description"
            value={eventInternal?.description || ""}
            onChange={handleEventChange}
            required
          />
        </label>
        <label>
          Дата начала
          <br />
          <input
            type="datetime-local"
            name="startDate"
            required
            value={eventInternal?.startDate.toISOString().slice(0, 16) || ""}
            onChange={handleEventChange}
          />
        </label>
        <label>
          Дата окончания
          <br />
          <input
            type="datetime-local"
            name="endDate"
            required
            value={eventInternal?.endDate.toISOString().slice(0, 16) || ""}
            onChange={handleEventChange}
          />
        </label>
        <MessageComponent message={response} />
        <div className={styles.buttons} style={{ marginBottom: "15px" }}>
          <button disabled={requestSent}>
            {requestSent && (
              <Spinner size={30} style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }} />
            )}
            Сохранить
          </button>
        </div>
      </form>
    </dialog>
  );
});
