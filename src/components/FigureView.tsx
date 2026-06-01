import {
  BL,
  BR,
  D1A,
  D1B,
  D2A,
  D2B,
  HL,
  HR,
  LB,
  LT,
  RB,
  RT,
  TL,
  TR,
  VB,
  VT,
  type Figure,
} from "@/game/figures";
import React from "react";
import Svg, { Rect } from "react-native-svg";

interface Props {
  figure: Figure;
  size?: number;
  color?: string;
}

// Параметры пиксельного рендеринга
const DOTS_PER_SEGMENT = 6; // одинаковое кол-во точек на каждый сегмент
const DOT_SIZE = 6; // размер "пикселя" в единицах viewBox
const INSET = 3 / 20; // отступ от концов (0–0.5), создаёт зазор между смежными сегментами

// 9 опорных точек в пространстве viewBox (100×100 с отступом p)
const p = 10;
const mid = 50;
const end = 100 - p;

const points = {
  TL: [p, p],
  TM: [mid, p],
  TR: [end, p],
  ML: [p, mid],
  C: [mid, mid],
  MR: [end, mid],
  BL: [p, end],
  BM: [mid, end],
  BR: [end, end],
} as const;

// Каждый сегмент = пара опорных точек [from, to]
const segmentLines: [number, readonly number[], readonly number[]][] = [
  [TL, points.TL, points.TM],
  [TR, points.TM, points.TR],
  [RT, points.TR, points.MR],
  [RB, points.MR, points.BR],
  [BR, points.BM, points.BR],
  [BL, points.BL, points.BM],
  [LB, points.ML, points.BL],
  [LT, points.TL, points.ML],
  [HL, points.ML, points.C],
  [HR, points.C, points.MR],
  [VT, points.TM, points.C],
  [VB, points.C, points.BM],
  [D1A, points.TL, points.C],
  [D1B, points.C, points.BR],
  [D2A, points.TR, points.C],
  [D2B, points.C, points.BL],
];

export default function FigureView({
  figure,
  size = 100,
  color = "#000",
}: Props) {
  const activeLines = segmentLines.filter(([bit]) => figure & bit);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {activeLines.flatMap(([bit, from, to]) => {
        const dots: React.ReactNode[] = [];
        for (let i = 0; i < DOTS_PER_SEGMENT; i++) {
          const t = INSET + (i / (DOTS_PER_SEGMENT - 1)) * (1 - 2 * INSET);
          const cx = from[0] + t * (to[0] - from[0]);
          const cy = from[1] + t * (to[1] - from[1]);
          dots.push(
            <Rect
              key={`${bit}-${i}`}
              x={cx - DOT_SIZE / 2}
              y={cy - DOT_SIZE / 2}
              width={DOT_SIZE}
              height={DOT_SIZE}
              fill={color}
            />,
          );
        }
        return dots;
      })}
    </Svg>
  );
}
