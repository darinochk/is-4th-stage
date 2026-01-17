import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ApiMessage } from "@/app/services/http";
import MessageComponent from "@/app/components/message";
import Spinner from "@/app/components/spinner";
import { Food, Order } from "@/app/services/api";
import { useAuthEffect } from "@/app/hooks/use-auth-effect";
import { foodService, orderService } from "@/app/services/api";
import styles from "./food-order-popup.module.css";

export default forwardRef(function FoodOrderPopup(
  {
    orderDetails,
    onOrder,
  }: {
    orderDetails: number;
    onOrder: (food: Order) => void;
  },
  ref: React.Ref<HTMLDialogElement | null>
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current!);

  const [response, setResponse] = useState<ApiMessage | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [food, setFood] = useState<Food[]>([]);

  useAuthEffect(() => {
    foodService.getFood().then(setFood);
  }, []);

  return (
    <dialog ref={dialogRef}>
      <form
        method="dialog"
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setRequestSent(true);
          setResponse(null);
          const form = e.currentTarget;
          orderService
            .addFoodToOrder(Object.fromEntries(new FormData(e.currentTarget)), setResponse)
            .then((resp) => {
              if (resp) {
                onOrder(resp);
                form.reset();
                dialogRef.current?.close();
                setResponse(null);
              }
              setRequestSent(false);
            });
        }}
      >
        <h3 className={styles.title}>Добавление еды</h3>
        <label>
          Выберите блюдо
          <br />
          <select name="foodId">
            {food.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Количество
          <br />
          <input type="number" name="quantity" required min={1} step={1} />
        </label>
        <input type="hidden" name="orderDetailsId" value={orderDetails} />
        <MessageComponent message={response} />
        <div className={styles.buttons}>
          <button
            onClick={(e) => {
              e.preventDefault();
              dialogRef.current?.close();
            }}
          >
            Отмена
          </button>
          <button disabled={requestSent}>
            {requestSent && (
              <Spinner size={30} style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }} />
            )}
            Добавить
          </button>
        </div>
      </form>
    </dialog>
  );
});
