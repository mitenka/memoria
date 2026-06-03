import { allFigures } from "../catalog";
import { ALL, count } from "../figures";
import { COMPLETE, isCorrect, makeRound, nextRound } from "../round";

describe("каталог фигур", () => {
  it("содержит ровно 32 фигуры (4 ряда × 8)", () => {
    expect(allFigures).toHaveLength(32);
  });

  it("все 32 фигуры уникальны", () => {
    const unique = new Set(allFigures);
    expect(unique.size).toBe(allFigures.length);
  });

  it("каждая фигура непуста и вложена в COMPLETE", () => {
    for (const f of allFigures) {
      expect(f).toBeGreaterThan(0);
      expect(f & ~ALL).toBe(0);
    }
  });
});

describe("makeRound", () => {
  it("screen — это COMPLETE без answer, они не пересекаются", () => {
    for (let i = 0; i < allFigures.length; i++) {
      const round = makeRound(i);
      expect(round.answer).toBe(allFigures[i]);
      expect(round.screen & round.answer).toBe(0);
      expect(round.screen | round.answer).toBe(COMPLETE);
    }
  });
});

describe("isCorrect", () => {
  it("принимает только загаданную кнопку", () => {
    for (let i = 0; i < allFigures.length; i++) {
      const round = makeRound(i);
      expect(isCorrect(round, round.answer)).toBe(true);

      for (let j = 0; j < allFigures.length; j++) {
        if (j === i) continue;
        // другая кнопка не должна проходить
        expect(isCorrect(round, allFigures[j])).toBe(false);
      }
    }
  });

  it("отвергает надмножество загаданной фигуры (ловушка полноты)", () => {
    // выбираем фигуру, к которой можно добавить недостающий бит
    const round = makeRound(0);
    const missingBit = round.screen & -round.screen; // младший бит экрана
    if (missingBit !== 0) {
      const superset = round.answer | missingBit;
      // по «полноте» прошла бы, но непересечение с экраном нарушено
      expect((round.screen | superset) === COMPLETE).toBe(true);
      expect(isCorrect(round, superset)).toBe(false);
    }
  });
});

describe("nextRound", () => {
  it("не повторяет предыдущую загаданную кнопку", () => {
    let prev = 5;
    for (let k = 0; k < 200; k++) {
      const r = nextRound(prev);
      expect(r.targetIndex).not.toBe(prev);
      prev = r.targetIndex;
    }
  });
});

describe("COMPLETE", () => {
  it("это полная 16-сегментная фигура", () => {
    expect(count(COMPLETE)).toBe(16);
  });
});
