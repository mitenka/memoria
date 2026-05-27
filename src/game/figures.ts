// ─── Модель фигуры ──────────────────────────────────────────────
//
// Фигура вписана в квадрат. Квадрат содержит 8 линий,
// каждая разделена на 2 половинки = 16 атомарных сегментов.
//
// Фигура = 16-битное число. Каждый бит = один сегмент (вкл/выкл).
//
//        TL   TR
//       ┌──┬──┐
//       │╲ │ ╱│
//   LT  │ ╲│╱ │  RT
//       ├──┼──┤
//   LB  │ ╱│╲ │  RB
//       │╱ │ ╲│
//       └──┴──┘
//        BL   BR
//
// Рамка (4 стороны × 2 половинки):
//   Top:    TL, TR     — верхняя сторона, левая и правая половины
//   Right:  RT, RB     — правая сторона, верхняя и нижняя половины
//   Bottom: BL, BR     — нижняя сторона, левая и правая половины
//   Left:   LT, LB     — левая сторона, верхняя и нижняя половины
//
// Внутренние (4 линии × 2 половинки, от центра к краю/углу):
//   Horizontal: HL, HR — горизонталь, от центра влево и вправо
//   Vertical:   VT, VB — вертикаль, от центра вверх и вниз
//   Diag ╲:     D1A, D1B — диагональ ╲, от центра к верх-лев и низ-прав
//   Diag ╱:     D2A, D2B — диагональ ╱, от центра к верх-прав и низ-лев
//

export type Figure = number;

// ─── Сегменты (каждый = один бит) ───────────────────────────────

// Рамка
export const TL = 1 << 0; // top-left
export const TR = 1 << 1; // top-right
export const RT = 1 << 2; // right-top
export const RB = 1 << 3; // right-bottom
export const BR = 1 << 4; // bottom-right
export const BL = 1 << 5; // bottom-left
export const LB = 1 << 6; // left-bottom
export const LT = 1 << 7; // left-top

// Внутренние
export const HL = 1 << 8; // horizontal-left (центр → лево)
export const HR = 1 << 9; // horizontal-right (центр → право)
export const VT = 1 << 10; // vertical-top (центр → верх)
export const VB = 1 << 11; // vertical-bottom (центр → низ)
export const D1A = 1 << 12; // diag ╲ верхняя часть (центр → верх-лев)
export const D1B = 1 << 13; // diag ╲ нижняя часть (центр → низ-прав)
export const D2A = 1 << 14; // diag ╱ верхняя часть (центр → верх-прав)
export const D2B = 1 << 15; // diag ╱ нижняя часть (центр → низ-лев)

// ─── Удобные группы ─────────────────────────────────────────────

export const TOP = TL | TR;
export const RIGHT = RT | RB;
export const BOTTOM = BL | BR;
export const LEFT = LT | LB;
export const FRAME = TOP | RIGHT | BOTTOM | LEFT;

export const HORIZ = HL | HR;
export const VERT = VT | VB;
export const DIAG1 = D1A | D1B; // полная ╲
export const DIAG2 = D2A | D2B; // полная ╱
export const INNER = HORIZ | VERT | DIAG1 | DIAG2;

export const ALL = FRAME | INNER; // все 16 сегментов

// ─── Операции ───────────────────────────────────────────────────

/** Объединение (экран + ответ = полная фигура) */
export function merge(a: Figure, b: Figure): Figure {
  return a | b;
}

/** Вычитание (полная - экран = ответ) */
export function subtract(whole: Figure, part: Figure): Figure {
  return whole & ~part;
}

/** Пересечение */
export function common(a: Figure, b: Figure): Figure {
  return a & b;
}

/** Проверка: A + B = whole? */
export function isComplete(a: Figure, b: Figure, whole: Figure): boolean {
  return (a | b) === whole;
}

/** Количество активных сегментов */
export function count(figure: Figure): number {
  let n = figure;
  let c = 0;
  while (n) {
    c += n & 1;
    n >>= 1;
  }
  return c;
}

/** Список активных сегментов (для отладки) */
export function activeSegments(figure: Figure): string[] {
  const names = [
    "TL",
    "TR",
    "RT",
    "RB",
    "BR",
    "BL",
    "LB",
    "LT",
    "HL",
    "HR",
    "VT",
    "VB",
    "D1A",
    "D1B",
    "D2A",
    "D2B",
  ];
  return names.filter((_, i) => figure & (1 << i));
}

/**
 * Разделяет фигуру на две непустые части случайным образом.
 * Каждый активный сегмент попадает в одну из двух половин.
 */
export function split(figure: Figure): [Figure, Figure] {
  const bits: number[] = [];
  for (let i = 0; i < 16; i++) {
    if (figure & (1 << i)) bits.push(1 << i);
  }
  if (bits.length < 2) {
    throw new Error("Нужно минимум 2 сегмента для разделения");
  }

  let a: Figure, b: Figure;
  do {
    a = 0;
    b = 0;
    for (const bit of bits) {
      if (Math.random() < 0.5) a |= bit;
      else b |= bit;
    }
  } while (a === 0 || b === 0);

  return [a, b];
}
