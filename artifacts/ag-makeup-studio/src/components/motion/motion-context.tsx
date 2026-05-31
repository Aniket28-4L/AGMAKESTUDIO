import { createContext, useContext } from "react";
import type Lenis from "lenis";

export interface MotionContextValue {
  isReady: boolean;
  lenis: Lenis | null;
}

export const MotionContext = createContext<MotionContextValue>({
  isReady: false,
  lenis: null,
});

export function useMotion() {
  return useContext(MotionContext);
}
