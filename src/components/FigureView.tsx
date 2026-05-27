import React from 'react';
import Svg, { Line } from 'react-native-svg';
import {
  TL, TR, RT, RB, BR, BL, LB, LT,
  HL, HR, VT, VB, D1A, D1B, D2A, D2B,
  type Figure,
} from '@/game/figures';

interface Props {
  figure: Figure;
  size?: number;
  color?: string;
}

// 9 опорных точек в пространстве viewBox (100×100 с отступом p)
const p = 10;
const mid = 50;
const end = 100 - p;

const points = {
  TL: [p, p],
  TM: [mid, p],
  TR: [end, p],
  ML: [p, mid],
  C:  [mid, mid],
  MR: [end, mid],
  BL: [p, end],
  BM: [mid, end],
  BR: [end, end],
} as const;

// Каждый сегмент = пара опорных точек [from, to]
const segmentLines: [number, readonly number[], readonly number[]][] = [
  [TL,  points.TL, points.TM],
  [TR,  points.TM, points.TR],
  [RT,  points.TR, points.MR],
  [RB,  points.MR, points.BR],
  [BR,  points.BM, points.BR],
  [BL,  points.BL, points.BM],
  [LB,  points.ML, points.BL],
  [LT,  points.TL, points.ML],
  [HL,  points.ML, points.C],
  [HR,  points.C,  points.MR],
  [VT,  points.TM, points.C],
  [VB,  points.C,  points.BM],
  [D1A, points.TL, points.C],
  [D1B, points.C,  points.BR],
  [D2A, points.TR, points.C],
  [D2B, points.C,  points.BL],
];

export default function FigureView({ figure, size = 100, color = '#000' }: Props) {
  const activeLines = segmentLines.filter(([bit]) => figure & bit);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {activeLines.map(([, from, to]) => (
        <Line
          key={`${from[0]},${from[1]}-${to[0]},${to[1]}`}
          x1={from[0]}
          y1={from[1]}
          x2={to[0]}
          y2={to[1]}
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}
