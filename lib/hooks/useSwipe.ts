import * as React from "react";
import { useRef } from "react";

export function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null);

  const onTouchStart = (event: React.TouchEvent) => {
    startX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (startX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? startX.current;
    const diff = endX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) onLeft();
      else onRight();
    }
    startX.current = null;
  };

  return { onTouchStart, onTouchEnd };
}
