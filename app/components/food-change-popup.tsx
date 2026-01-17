import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "@/app/(auth)/login/page.module.css";
import Spinner from "@/app/components/spinner";
import MessageComponent from "@/app/components/message";
import { Food } from "@/api/food";
import { Message } from "@/api/api";

interface FoodChangePopupProps {
  food: Food;
  setFood: (food: Food) => Promise<Message>;
}

const FoodChangePopup = forwardRef<HTMLDialogElement, FoodChangePopupProps>(
  ({ food, setFood }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => dialogRef.current!);

    const [foodInternal, setFoodInternal] = useState<Food>(food);
    const [response, setResponse] = useState<Message | null>(null);
    const [requestSent, setRequestSent] = useState<boolean>(false);

    useEffect(() => {
      setFoodInternal(food);
    }, [food]);

    const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFoodInternal({
        ...foodInternal,
        [e.currentTarget.name]: e.currentTarget.value,
      });
    };

    return (
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "DIALOG" && e.target === e.currentTarget) {
            dialogRef.current?.close();
          }
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
            setFood(foodInternal).then((resp) => {
              if (!resp.isError) {
                dialogRef.current?.close();
              } else {
                setResponse(resp);
              }
              setRequestSent(false);
            });
          }}
        >
          <h3>Изменение данных о еде</h3>
          <label>
            Название
            <br />
            <input
              type="text"
              name="name"
              value={foodInternal.name || ""}
              onChange={handleFoodChange}
              required
            />
          </label>
          <label>
            Тип
            <br />
            <input
              type="text"
              name="foodType"
              value={foodInternal.foodType || ""}
              onChange={handleFoodChange}
              required
            />
          </label>
          <label>
            Цена
            <br />
            <input
              type="number"
              name="price"
              value={foodInternal.price || ""}
              onChange={handleFoodChange}
              required
              min={1}
              step={1}
            />
          </label>
          <MessageComponent message={response} />
          <div className={styles.buttons} style={{ marginBottom: "15px" }}>
            <button disabled={requestSent}>
              {requestSent && (
                <Spinner
                  size={30}
                  style={{ margin: "-11px 0 -11px -32px", paddingRight: "32px" }}
                />
              )}
              Сохранить
            </button>
          </div>
        </form>
      </dialog>
    );
  }
);
export default FoodChangePopup;
