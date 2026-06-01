import {
  BL,
  BR,
  D1A,
  D1B,
  D2A,
  D2B,
  DIAG1,
  DIAG2,
  HL,
  HORIZ,
  LB,
  LT,
  RB,
  RT,
  TL,
  TR,
  VERT,
  VT,
  type Figure,
} from "./figures";

/**
 * Каталог из 32 фигур оригинального автомата «Память».
 * 4 ряда × 8 фигур.
 *
 * TODO: сверить с фото оригинала и поправить.
 */

// ─── Ряд 1 ─────────────────────────────────────────────────────

const row1: Figure[] = [
  /* 1  */ HORIZ | VERT | LB | BL | BR | RB,
  /* 2  */ HORIZ | DIAG1 | DIAG2 | LT | RB,
  /* 3  */ LB | BR | RT | TL | VERT | HL | D2B,
  /* 4  */ TL | TR | BL | BR | VERT | D1A | D2A,
  /* 5  */ HORIZ | VERT | TL | TR | LB | RB,
  /* 6  */ HORIZ | VERT | D2A | D2B | LB | TR,
  /* 7  */ D1A | D2A | D1B | D2B | LT | BR | RT | TR,
  /* 8  */ LT | LB | BR | RT | TL | HL | VT | D2B,
];

// ─── Ряд 2 ─────────────────────────────────────────────────────

const row2: Figure[] = [
  /* 9  */ LT | LB | RT | RB | VERT | D2A | D2B,
  /* 10 */ BL | BR | RB | VERT | D1A | D2A | D2B,
  /* 11 */ LB | BR | RT | TL | HORIZ | VT | D2B,
  /* 12 */ TL | TR | BL | BR | HORIZ | D2A | D2B,
  /* 13 */ TL | TR | BL | BR | VERT | LB | RT,
  /* 14 */ LT | LB | RT | RB | TR | BR | D1A | D2B,
  /* 15 */ LT | RT | BL | BR | D1A | D2A | D1B | D2B,
  /* 16 */ BL | BR | RB | RT | HORIZ | VERT,
];

// ─── Ряд 3 ─────────────────────────────────────────────────────

const row3: Figure[] = [
  /* 17 */ TL | BR | LB | RT | D2A | D2B | HL | VT,
  /* 18 */ LT | LB | RT | RB | BR | TL | D1A | D1B,
  /* 19 */ D1A | D1B | D2A | D2B | LT | BR | RB | TL,
  /* 20 */ LT | LB | BL | RT | HL | D1A | D1B | D2A,
  /* 21 */ D1A | D1B | D2A | D2B | VERT | RT | RB,
  /* 22 */ D1A | D1B | D2A | D2B | LB | BL | RT | TR,
  /* 23 */ HORIZ | VERT | TL | BL | D1B | D2A,
  /* 24 */ TL | TR | BL | BR | HORIZ | D1A | D1B,
];

// ─── Ряд 4 ─────────────────────────────────────────────────────

const row4: Figure[] = [
  /* 25 */ HORIZ | VERT | D2A | D2B | LB | RT,
  /* 26 */ LT | LB | RT | RB | VERT | D1A | D1B,
  /* 27 */ LT | LB | RT | RB | HORIZ | D1B | D2B,
  /* 28 */ HORIZ | VERT | D1A | D1B | TL | RB,
  /* 29 */ HORIZ | VERT | LT | BR | RB | TL,
  /* 30 */ D1A | D1B | D2A | D2B | LB | BL | RB | TL,
  /* 31 */ HORIZ | VERT | LB | BL | RT | TR,
  /* 32 */ D1A | D1B | D2A | D2B | TL | TR | LT | RT,
];

// ─── Экспорт ────────────────────────────────────────────────────

export const rows: Figure[][] = [row1, row2, row3, row4];

export const allFigures: Figure[] = [...row1, ...row2, ...row3, ...row4];

export function figureAt(row: number, col: number): Figure {
  return rows[row][col];
}
