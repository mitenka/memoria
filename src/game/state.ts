import { rowOf } from "./catalog";
import {
  BONUS_TIME_MS,
  FIGURE_TIME_MS,
  PRIZE_THRESHOLD,
  ROUND_TIME_MS,
} from "./config";
import { type Figure } from "./figures";
import { isCorrect, nextRound, type Round } from "./round";

// ─── Машина состояний игры ──────────────────────────────────────
//
// idle → main(120с) → result → bonus(120с, если ≥20) → gameover
//
// Чистые функции переходов (без React) — легко тестируются.

export type Phase = "idle" | "main" | "result" | "bonus" | "gameover";
export type Feedback = "none" | "success" | "fail";

export interface GameState {
  phase: Phase;
  round: Round | null;
  /** Очки текущей фазы (main или bonus). */
  score: number;
  /** Очки основного раунда (для порога приза и экрана результата). */
  mainScore: number;
  /** Очки призового раунда. */
  bonusScore: number;
  /** Исход последней фигуры — для смайлика. */
  feedback: Feedback;
  roundTimeLeft: number;
  figureTimeLeft: number;
}

export function initialState(): GameState {
  return {
    phase: "idle",
    round: null,
    score: 0,
    mainScore: 0,
    bonusScore: 0,
    feedback: "none",
    roundTimeLeft: 0,
    figureTimeLeft: 0,
  };
}

function withNewFigure(state: GameState, feedback: Feedback): GameState {
  return {
    ...state,
    round: nextRound(state.round?.targetIndex),
    feedback,
    figureTimeLeft: FIGURE_TIME_MS,
  };
}

/** Старт основного раунда. */
export function startMain(): GameState {
  return {
    ...initialState(),
    phase: "main",
    round: nextRound(),
    roundTimeLeft: ROUND_TIME_MS,
    figureTimeLeft: FIGURE_TIME_MS,
  };
}

/** Нажатие кнопки в игровой фазе. */
export function answer(state: GameState, pressed: Figure): GameState {
  if ((state.phase !== "main" && state.phase !== "bonus") || !state.round) {
    return state;
  }
  const correct = isCorrect(state.round, pressed);
  const score = correct ? state.score + 1 : state.score;
  return withNewFigure({ ...state, score }, correct ? "success" : "fail");
}

/** Тик времени (dtMs мс прошло). */
export function tick(state: GameState, dtMs: number): GameState {
  if (state.phase !== "main" && state.phase !== "bonus") return state;

  let s: GameState = {
    ...state,
    roundTimeLeft: state.roundTimeLeft - dtMs,
    figureTimeLeft: state.figureTimeLeft - dtMs,
  };

  if (s.roundTimeLeft <= 0) {
    s.roundTimeLeft = 0;
    return s.phase === "main"
      ? { ...s, phase: "result", mainScore: s.score }
      : { ...s, phase: "gameover", bonusScore: s.score };
  }

  if (s.figureTimeLeft <= 0) {
    s = withNewFigure(s, "fail");
  }

  return s;
}

/** Переход после экрана результата: призовая игра или конец. */
export function proceedFromResult(state: GameState): GameState {
  if (state.phase !== "result") return state;
  if (state.mainScore >= PRIZE_THRESHOLD) {
    return {
      ...state,
      phase: "bonus",
      round: nextRound(),
      score: 0,
      feedback: "none",
      roundTimeLeft: BONUS_TIME_MS,
      figureTimeLeft: FIGURE_TIME_MS,
    };
  }
  return { ...state, phase: "gameover", bonusScore: 0 };
}

/**
 * Ряд с правильной кнопкой для подсказки.
 * Подсказка только в основном раунде; в призовом её нет (null).
 */
export function hintRow(state: GameState): number | null {
  if (state.phase !== "main" || !state.round) return null;
  return rowOf(state.round.targetIndex);
}
