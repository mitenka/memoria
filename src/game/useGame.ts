import { useCallback, useEffect, useRef, useState } from "react";

import { type Figure } from "./figures";
import {
  type HighScores,
  loadHighScores,
  saveBestBonus,
  saveBestMain,
} from "./highscores";
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
 * Хук игрового процесса: хранит состояние, крутит таймеры и ведёт рекорды.
 * Интервал работает только в игровых фазах (main/bonus).
 */
export function useGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [best, setBest] = useState<HighScores>({ main: 0, bonus: 0 });
  const [newRecord, setNewRecord] = useState({ main: false, bonus: false });
  const lastRef = useRef(0);
  const bestRef = useRef(best);
  bestRef.current = best;

  const running = state.phase === "main" || state.phase === "bonus";

  // Загрузка рекордов при старте.
  useEffect(() => {
    loadHighScores().then(setBest);
  }, []);

  // Игровой таймер.
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

  // Фиксация рекордов на переходах: основной — на result, призовой — на gameover.
  useEffect(() => {
    if (state.phase === "result") {
      const isRecord = state.mainScore > bestRef.current.main;
      setNewRecord((r) => ({ ...r, main: isRecord }));
      if (isRecord) {
        setBest((b) => ({ ...b, main: state.mainScore }));
        saveBestMain(state.mainScore);
      }
    } else if (state.phase === "gameover") {
      // gameover достижим напрямую (без приза) — фиксируем оба рекорда.
      const newMain = state.mainScore > bestRef.current.main;
      const newBonus = state.bonusScore > bestRef.current.bonus;
      setNewRecord({ main: newMain, bonus: newBonus });
      if (newMain) {
        setBest((b) => ({ ...b, main: state.mainScore }));
        saveBestMain(state.mainScore);
      }
      if (newBonus) {
        setBest((b) => ({ ...b, bonus: state.bonusScore }));
        saveBestBonus(state.bonusScore);
      }
    } else if (state.phase === "main") {
      setNewRecord({ main: false, bonus: false });
    }
  }, [state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(() => setState(startMain()), []);
  const press = useCallback(
    (f: Figure) => setState((s) => applyAnswer(s, f)),
    [],
  );
  const proceed = useCallback(() => setState((s) => proceedFromResult(s)), []);
  const reset = useCallback(() => setState(initialState()), []);

  return { state, best, newRecord, start, press, proceed, reset };
}
