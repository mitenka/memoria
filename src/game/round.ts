import { allFigures } from "./catalog";
import { ALL, subtract, type Figure } from "./figures";

// ─── Раунд ──────────────────────────────────────────────────────
//
// «Готовая» фигура постоянна и равна ALL (полная 16-сегментная).
// Каждый раунд:
//   1. загадываем кнопку answer (одна из 32 фигур каталога);
//   2. на экране показываем недостающее: screen = ALL \ answer;
//   3. игрок должен нажать кнопку, которая дополняет экран до ALL.
//

/** «Готовая» фигура — полная 16-сегментная. */
export const COMPLETE: Figure = ALL;

export interface Round {
  /** Индекс загаданной кнопки в allFigures (0..31). */
  targetIndex: number;
  /** Фигура правильной кнопки (недостающая часть). */
  answer: Figure;
  /** Что показано на экране: COMPLETE без answer. */
  screen: Figure;
}

/** Собирает раунд по индексу загаданной кнопки. */
export function makeRound(targetIndex: number): Round {
  const answer = allFigures[targetIndex];
  return {
    targetIndex,
    answer,
    screen: subtract(COMPLETE, answer),
  };
}

/**
 * Случайный следующий раунд.
 * Не повторяет предыдущую загаданную кнопку (если она задана).
 */
export function nextRound(prevIndex?: number): Round {
  const n = allFigures.length;
  let i = Math.floor(Math.random() * n);
  if (prevIndex !== undefined && n > 1) {
    while (i === prevIndex) {
      i = Math.floor(Math.random() * n);
    }
  }
  return makeRound(i);
}

/**
 * Проверка ответа булевой логикой.
 * Кнопка верна, если она вместе с экраном даёт ровно COMPLETE
 * и при этом не пересекается с экраном (точное дополнение).
 * Условие непересечения отсекает «надмножества» загаданной фигуры,
 * гарантируя единственность правильного ответа.
 */
export function isCorrect(round: Round, pressed: Figure): boolean {
  return (round.screen | pressed) === COMPLETE && (round.screen & pressed) === 0;
}
