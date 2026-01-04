import { EffectCallback, useEffect } from "react";
import { useUserStore } from "@/context/user-store";

export function useAuthEffect(effect: EffectCallback, deps?: React.DependencyList) {
  const state = useUserStore();

  useEffect(
    () => {
      if (state.inited && state.user) {
        effect();
      }
    },
    (deps || []).concat(state)
  );
}
