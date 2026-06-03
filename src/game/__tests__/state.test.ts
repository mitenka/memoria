import {
  BONUS_TIME_MS,
  FIGURE_TIME_MS,
  PRIZE_THRESHOLD,
  ROUND_TIME_MS,
} from "../config";
import { makeRound } from "../round";
import {
  answer,
  hintRow,
  initialState,
  proceedFromResult,
  startMain,
  tick,
  type GameState,
} from "../state";

describe("startMain", () => {
  it("запускает основной раунд с полными таймерами", () => {
    const s = startMain();
    expect(s.phase).toBe("main");
    expect(s.round).not.toBeNull();
    expect(s.score).toBe(0);
    expect(s.roundTimeLeft).toBe(ROUND_TIME_MS);
    expect(s.figureTimeLeft).toBe(FIGURE_TIME_MS);
  });
});

function mainStateWithRound(targetIndex: number): GameState {
  return { ...startMain(), round: makeRound(targetIndex) };
}

describe("answer", () => {
  it("верный ответ: +1 очко, новый раунд, смайлик success", () => {
    const s = mainStateWithRound(3);
    const next = answer(s, s.round!.answer);
    expect(next.score).toBe(1);
    expect(next.feedback).toBe("success");
    expect(next.figureTimeLeft).toBe(FIGURE_TIME_MS);
  });

  it("ошибка: очки не меняются, новый раунд, смайлик fail", () => {
    const s = mainStateWithRound(3);
    const wrong = s.round!.screen; // точно не равно дополнению
    const next = answer(s, wrong);
    expect(next.score).toBe(0);
    expect(next.feedback).toBe("fail");
  });

  it("игнорируется вне игровой фазы", () => {
    const s = initialState();
    expect(answer(s, 1)).toBe(s);
  });

  it("инкрементирует seq на каждый ответ (триггер анимации смайлика)", () => {
    const s = mainStateWithRound(3);
    const a = answer(s, s.round!.answer);
    expect(a.seq).toBe(s.seq + 1);
    const b = answer(a, a.round!.screen); // ошибка
    expect(b.seq).toBe(a.seq + 1);
  });
});

describe("tick", () => {
  it("уменьшает оба таймера", () => {
    const s = startMain();
    const next = tick(s, 500);
    expect(next.roundTimeLeft).toBe(ROUND_TIME_MS - 500);
    expect(next.figureTimeLeft).toBe(FIGURE_TIME_MS - 500);
  });

  it("истечение времени фигуры → новая фигура и смайлик fail", () => {
    const s = startMain();
    const next = tick(s, FIGURE_TIME_MS);
    expect(next.feedback).toBe("fail");
    expect(next.figureTimeLeft).toBe(FIGURE_TIME_MS);
    expect(next.phase).toBe("main");
  });

  it("конец основного раунда: < порога → сразу gameover с mainScore", () => {
    const s: GameState = { ...startMain(), score: 7 };
    const next = tick(s, ROUND_TIME_MS);
    expect(next.phase).toBe("gameover");
    expect(next.mainScore).toBe(7);
  });

  it("конец основного раунда: ≥ порога → result с mainScore", () => {
    const s: GameState = { ...startMain(), score: PRIZE_THRESHOLD };
    const next = tick(s, ROUND_TIME_MS);
    expect(next.phase).toBe("result");
    expect(next.mainScore).toBe(PRIZE_THRESHOLD);
  });

  it("конец призового раунда → gameover с bonusScore", () => {
    const s: GameState = {
      ...startMain(),
      phase: "bonus",
      score: 4,
      roundTimeLeft: BONUS_TIME_MS,
    };
    const next = tick(s, BONUS_TIME_MS);
    expect(next.phase).toBe("gameover");
    expect(next.bonusScore).toBe(4);
  });
});

describe("proceedFromResult", () => {
  it("result → призовая игра (result показывается только при открытом призе)", () => {
    const s: GameState = {
      ...initialState(),
      phase: "result",
      mainScore: PRIZE_THRESHOLD,
    };
    const next = proceedFromResult(s);
    expect(next.phase).toBe("bonus");
    expect(next.score).toBe(0);
    expect(next.roundTimeLeft).toBe(BONUS_TIME_MS);
  });

  it("игнорируется вне фазы result", () => {
    const s = startMain();
    expect(proceedFromResult(s)).toBe(s);
  });
});

describe("hintRow", () => {
  it("возвращает ряд правильной кнопки в основном раунде", () => {
    const s: GameState = { ...startMain(), round: makeRound(10) };
    expect(hintRow(s)).toBe(1); // индекс 10 → второй ряд (0..7, 8..15)
  });

  it("нет подсказки в призовом раунде", () => {
    const s: GameState = {
      ...startMain(),
      phase: "bonus",
      round: makeRound(10),
    };
    expect(hintRow(s)).toBeNull();
  });

  it("нет подсказки вне игры", () => {
    expect(hintRow(initialState())).toBeNull();
  });
});
