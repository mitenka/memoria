import { useEffect, useState } from "react";
import Svg, { Rect } from "react-native-svg";

import { type Feedback } from "@/game/state";

interface Props {
  mood: Feedback;
  /** Меняется на каждый ответ — перезапускает анимацию гашения. */
  seq?: number;
  size?: number;
}

// Пиксельный смайлик средней плотности (сетка 9×9).
// При каждом новом ответе вспыхивает целиком и осыпается попиксельно
// в случайном порядке (ретро-эффект гаснущего люминофора).
const GRID = 9;
const CELL = 9;
const DOT = 7;
const HOLD_MS = 850; // показываем смайлик целиком перед осыпанием
const FADE_MS = 950;

const EYES: [number, number][] = [
  [2, 2],
  [2, 3],
  [3, 2],
  [3, 3],
  [2, 5],
  [2, 6],
  [3, 5],
  [3, 6],
];

const MOUTHS: Record<Feedback, [number, number][]> = {
  // улыбка: уголки вверх, низ — по центру
  success: [
    [5, 2],
    [5, 6],
    [6, 2],
    [6, 6],
    [7, 3],
    [7, 4],
    [7, 5],
  ],
  // грусть: центр вверх, уголки вниз
  fail: [
    [5, 3],
    [5, 4],
    [5, 5],
    [6, 2],
    [6, 6],
    [7, 2],
    [7, 6],
  ],
  // нейтрально: прямая линия
  none: [
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5],
    [6, 6],
  ],
};

const COLORS: Record<Feedback, string> = {
  success: "#3FB950",
  fail: "#F85149",
  none: "#8B949E",
};

function shuffledRange(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Smiley({ mood, seq = 0, size = 56 }: Props) {
  const cells = [...EYES, ...MOUTHS[mood]];
  const n = cells.length;
  const color = COLORS[mood];
  const span = GRID * CELL;

  const [hidden, setHidden] = useState<boolean[]>(() =>
    new Array(n).fill(false),
  );

  useEffect(() => {
    // Вспыхиваем целиком.
    setHidden(new Array(n).fill(false));

    // Нейтральная мина не гаснет (нет результата для показа).
    if (mood === "none") return;

    const order = shuffledRange(n);
    const step = Math.max(24, FADE_MS / n);
    let k = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    // Держим полный смайлик HOLD_MS, затем осыпаем попиксельно.
    const hold = setTimeout(() => {
      interval = setInterval(() => {
        const idx = order[k];
        setHidden((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        k += 1;
        if (k >= n && interval) clearInterval(interval);
      }, step);
    }, HOLD_MS);

    return () => {
      clearTimeout(hold);
      if (interval) clearInterval(interval);
    };
  }, [seq, mood, n]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${span} ${span}`}>
      {cells.map(([r, c], i) =>
        hidden[i] ? null : (
          <Rect
            key={i}
            x={c * CELL + (CELL - DOT) / 2}
            y={r * CELL + (CELL - DOT) / 2}
            width={DOT}
            height={DOT}
            fill={color}
          />
        ),
      )}
    </Svg>
  );
}
