// Генератор иконок приложения из того же «точечного» движка, что и фигуры в игре.
// Рисует полную 16-сегментную фигуру (ALL) точками, как FigureView.
//
// Запуск:  node scripts/gen-icon.mjs
// Требует: ImageMagick (`magick`) для конвертации SVG -> PNG.

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

// ─── Геометрия (1-в-1 с src/components/FigureView.tsx) ──────────────
const DOTS_PER_SEGMENT = 6;
const INSET = 3 / 20;

const p = 10;
const mid = 50;
const end = 90;
const pt = {
  TL: [p, p],
  TM: [mid, p],
  TR: [end, p],
  ML: [p, mid],
  C: [mid, mid],
  MR: [end, mid],
  BL: [p, end],
  BM: [mid, end],
  BR: [end, end],
};

// Все 16 сегментов = полная фигура ALL.
const segments = [
  [pt.TL, pt.TM], // TL
  [pt.TM, pt.TR], // TR
  [pt.TR, pt.MR], // RT
  [pt.MR, pt.BR], // RB
  [pt.BM, pt.BR], // BR
  [pt.BL, pt.BM], // BL
  [pt.ML, pt.BL], // LB
  [pt.TL, pt.ML], // LT
  [pt.ML, pt.C], // HL
  [pt.C, pt.MR], // HR
  [pt.TM, pt.C], // VT
  [pt.C, pt.BM], // VB
  [pt.TL, pt.C], // D1A
  [pt.C, pt.BR], // D1B
  [pt.TR, pt.C], // D2A
  [pt.C, pt.BL], // D2B
];

// ─── Построение SVG ─────────────────────────────────────────────────
function buildSvg({ size, margin, bg, dot, rx = 0 }) {
  // Рамка фигуры (box 10..90) маппится в [margin, size-margin].
  const scale = (size - 2 * margin) / 80;
  const toCanvas = (v) => margin + (v - 10) * scale;
  const dotPx = 6 * scale;

  const rects = [];
  for (const [from, to] of segments) {
    for (let i = 0; i < DOTS_PER_SEGMENT; i++) {
      const t = INSET + (i / (DOTS_PER_SEGMENT - 1)) * (1 - 2 * INSET);
      const cx = toCanvas(from[0] + t * (to[0] - from[0]));
      const cy = toCanvas(from[1] + t * (to[1] - from[1]));
      const x = (cx - dotPx / 2).toFixed(2);
      const y = (cy - dotPx / 2).toFixed(2);
      const s = dotPx.toFixed(2);
      const r = rx ? ` rx="${(dotPx * rx).toFixed(2)}"` : "";
      rects.push(
        `<rect x="${x}" y="${y}" width="${s}" height="${s}"${r} fill="${dot}"/>`,
      );
    }
  }

  const background = bg
    ? `<rect width="${size}" height="${size}" fill="${bg}"/>`
    : "";

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${background}${rects.join(
    "",
  )}</svg>`;
}

// ─── Цели генерации ─────────────────────────────────────────────────
const BLUE = "#208AEF";
const LIGHT = "#EAF4FF";

const tmp = mkdtempSync(join(tmpdir(), "memoria-icon-"));

const targets = [
  // Основная иконка: светлые точки на фирменном синем (full-bleed, iOS сам скруглит).
  {
    name: "icon",
    svg: { size: 1024, margin: 150, bg: BLUE, dot: LIGHT },
    png: "assets/images/icon.png",
  },
  // Android foreground: синие точки на прозрачном (фон даёт adaptiveIcon.backgroundColor).
  // Увеличенный margin под безопасную зону adaptive-маски.
  {
    name: "android-foreground",
    svg: { size: 1024, margin: 240, bg: null, dot: BLUE },
    png: "assets/images/android-icon-foreground.png",
  },
  // Android monochrome: белый силуэт на прозрачном (система перекрашивает).
  {
    name: "android-monochrome",
    svg: { size: 1024, margin: 240, bg: null, dot: "#FFFFFF" },
    png: "assets/images/android-icon-monochrome.png",
  },
  // Splash: светлые точки на прозрачном (фон сплэша — синий).
  {
    name: "splash",
    svg: { size: 1024, margin: 120, bg: null, dot: LIGHT },
    png: "assets/images/splash-icon.png",
  },
  // Favicon (web).
  {
    name: "favicon",
    svg: { size: 256, margin: 30, bg: BLUE, dot: LIGHT },
    png: "assets/images/favicon.png",
  },
  // iOS Icon Composer layer (белые точки, прозрачный фон — поверх градиента + сетки).
  {
    name: "ios-layer",
    svg: { size: 1024, margin: 210, bg: null, dot: "#FFFFFF" },
    out: "assets/expo.icon/Assets/figure.svg",
  },
];

for (const t of targets) {
  const svg = buildSvg(t.svg);

  if (t.out) {
    // Сохраняем SVG напрямую (для Icon Composer).
    writeFileSync(join(ROOT, t.out), svg + "\n");
    console.log(`svg  -> ${t.out}`);
    continue;
  }

  const svgPath = join(tmp, `${t.name}.svg`);
  writeFileSync(svgPath, svg);
  const pngPath = join(ROOT, t.png);
  execFileSync("magick", [
    "-background",
    "none",
    svgPath,
    "-resize",
    `${t.svg.size}x${t.svg.size}`,
    pngPath,
  ]);
  console.log(`png  -> ${t.png}`);
}

console.log("\nГотово. Точечная фигура сгенерирована во все слоты иконок.");
