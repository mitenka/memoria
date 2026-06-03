import { useCallback, useEffect, useRef, useState } from "react";

import { type Figure } from "./figures";
import {
  answer as applyAnswer,
  type GameState,
  initialState,
  proceedFromResult,
  startMain,
  tick,
} from "./state";

const TICK_MS = 100;

/**
 * Хук игрового процесса: хранит состояние и крутит таймеры.
 * Интервал работает только в игровых фазах (main/bonus).
 */
export function useGame() {
  const [state, setState] = useState<GameState>(initialState);
  const lastRef = useRef(0);

  const running = state.phase === "main" || state.phase === "bonus";

  useEffect(() => {
    if (!running) return;
    lastRef.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - lastRef.current;
      lastRef.current = now;
      setState((s) => tick(s, dt));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback(() => setState(startMain()), []);
  const press = useCallback((f: Figure) => setState((s) => applyAnswer(s, f)), []);
  const proceed = useCallback(() => setState((s) => proceedFromResult(s)), []);
  const reset = useCallback(() => setState(initialState()), []);

  return { state, start, press, proceed, reset };
}
