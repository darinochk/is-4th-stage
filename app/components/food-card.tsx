import { useRef } from "react";
import { Food } from "@/app/services/api";
import { foodService } from "@/app/services/api";
import { useUserStore } from "@/context/user-store";
import FoodChangePopup from "@/app/components/food-change-popup";
import styles from "@/app/(content)/bookings/page.module.css";

interface FoodCardProps {
  food: Food;
  onFoodChange: (food: Food | null) => void;
}

export function FoodCard({ food, onFoodChange }: FoodCardProps) {
  const isAdmin = useUserStore((state) => state.user?.role === "ADMIN");
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div key={food.id} className={styles.booking}>
      <h2>Название:</h2> <h2>{food.name}</h2>
      <p>Тип:</p> <p>{food.foodType}</p>
      <p>Цена:</p> <p>{food.price}₽</p>
      {isAdmin && (
        <>
          <button onClick={() => dialogRef.current?.showModal()}>Изменить</button>
          <button
            onClick={() => {
              foodService.deleteFood(food.id).then(() => onFoodChange(null));
            }}
          >
            Удалить
          </button>
        </>
      )}
      <FoodChangePopup
        food={food}
        setFood={(updatedFood) => {
          return new Promise((resolve) => {
            foodService.updateFood(food.id, updatedFood, resolve).then((fd) => {
              if (fd) {
                onFoodChange(fd);
              }
            });
          });
        }}
        ref={dialogRef}
      />
    </div>
  );
}
