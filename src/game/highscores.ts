import AsyncStorage from "@react-native-async-storage/async-storage";

// Рекорды хранятся раздельно: основной и призовой раунды — разные режимы
// (в призовом нет подсказок), сравнивать их одним числом некорректно.

export interface HighScores {
  main: number;
  bonus: number;
}

const KEY_MAIN = "memoria.best.main";
const KEY_BONUS = "memoria.best.bonus";

export async function loadHighScores(): Promise<HighScores> {
  try {
    const [main, bonus] = await Promise.all([
      AsyncStorage.getItem(KEY_MAIN),
      AsyncStorage.getItem(KEY_BONUS),
    ]);
    return {
      main: main ? Number(main) || 0 : 0,
      bonus: bonus ? Number(bonus) || 0 : 0,
    };
  } catch {
    return { main: 0, bonus: 0 };
  }
}

export async function saveBestMain(value: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_MAIN, String(value));
  } catch {
    // молча игнорируем сбой записи
  }
}

export async function saveBestBonus(value: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_BONUS, String(value));
  } catch {
    // молча игнорируем сбой записи
  }
}
