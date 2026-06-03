import React from "react";
import Svg, { Rect } from "react-native-svg";

import { type Feedback } from "@/game/state";

interface Props {
  mood: Feedback;
  size?: number;
}

// Пиксельный смайлик 7×7, рисуется теми же квадратами, что и фигуры.
const GRID = 7;
const CELL = 10;
const DOT = 8;

const EYES: [number, number][] = [
  [1, 1],
  [1, 5],
  [2, 1],
  [2, 5],
];

const MOUTHS: Record<Feedback, [number, number][]> = {
  // улыбка: уголки вверх (ряд 5), низ — по центру (ряд 6)
  success: [
    [5, 1],
    [5, 5],
    [6, 2],
    [6, 3],
    [6, 4],
  ],
  // грусть: центр вверх (ряд 5), уголки вниз (ряд 6)
  fail: [
    [5, 2],
    [5, 3],
    [5, 4],
    [6, 1],
    [6, 5],
  ],
  // нейтрально: прямая линия
  none: [
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5],
  ],
};

const COLORS: Record<Feedback, string> = {
  success: "#3FB950",
  fail: "#F85149",
  none: "#8B949E",
};

export default function Smiley({ mood, size = 48 }: Props) {
  const cells = [...EYES, ...MOUTHS[mood]];
  const color = COLORS[mood];
  const span = GRID * CELL;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${span} ${span}`}>
      {cells.map(([r, c], i) => (
        <Rect
          key={i}
          x={c * CELL + (CELL - DOT) / 2}
          y={r * CELL + (CELL - DOT) / 2}
          width={DOT}
          height={DOT}
          fill={color}
        />
      ))}
    </Svg>
  );
}
