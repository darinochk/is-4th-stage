import { PayForOrder, Payment } from "@/api/payment";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Message } from "@/api/api";
import MessageComponent from "@/app/components/message";
import styles from "@/app/(auth)/login/page.module.css";
import Spinner from "@/app/components/spinner";
export default forwardRef(function PaymentPopup(
  {
    payment,
    setPayment,
  }: {
    payment: Payment;
    setPayment: (payment: Payment) => void;
  },
  ref: React.Ref<HTMLDialogElement | null>
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current!);
  const [response, setResponse] = useState<Message | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  return (
    <dialog
      style={{ padding: "10px" }}
      ref={dialogRef}
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === "DIALOG" && e.target === e.currentTarget)
          dialogRef.current?.close();
      }}
    >
      <h1>Оплата</h1>
      <p>Заказчик: {payment.fullName}</p>
      <p>Описание: {payment.description}</p>
      <p>Email: {payment.email}</p>
      <p>Транзакция: {payment?.transaction?.id}</p>
      <p>Сумма: {payment.amount}</p>
      <p>Статус: {payment?.transaction?.status}</p>
      <MessageComponent message={response} />
      <div className={styles.buttons}>
        <button
          disabled={requestSent}
          onClick={() => {
            setResponse(null);
            setRequestSent(true);
            PayForOrder(payment.id, "", setResponse).then((pay) => {
              setPayment(pay);
              setRequestSent(false);
            });
          }}
        >
          {requestSent && (
            <Spinner size={30} style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }} />
          )}
          Оплатить
        </button>
      </div>
    </dialog>
  );
});
