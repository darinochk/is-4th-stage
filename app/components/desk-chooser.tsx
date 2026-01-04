"use client";
import "./user-chooser.css";
import { useEffect, useState } from "react";
import { useUserStore } from "@/context/user-store";
import { Desk } from "@/app/services/api";
import { deskService } from "@/app/services/api";

export function DeskChooser({
  setDeskAction,
}: {
  setDeskAction: ({ deskNumber, id }: { deskNumber: number; id: number | "all" }) => void;
}) {
  const [desks, setDesks] = useState<Desk[]>([]);
  const inited = useUserStore((state) => state.inited);

  useEffect(() => {
    if (inited) deskService.getDesks().then(setDesks);
  }, [inited]);

  return (
    <div className="chooser">
      <select
        onChange={(e) => {
          if (e.currentTarget.value == "") setDeskAction({ deskNumber: -1, id: -1 });
          else if (e.currentTarget.value === "all") {
            setDeskAction({ deskNumber: -1, id: "all" });
          } else {
            const id = +e.currentTarget.value;
            setDeskAction({ deskNumber: desks.find((e) => e.id == id)!.deskNumber, id });
          }
        }}
      >
        <option value="">Номер столика...</option>
        <option value="all">Все бронирования</option>
        {desks.map((d) => (
          <option key={d.id} value={d.id}>
            {d.deskNumber}
          </option>
        ))}
      </select>
    </div>
  );
}
