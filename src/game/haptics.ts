import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Тактильный отклик. На вебе нет поддержки — тихо игнорируем.
const enabled = Platform.OS === "ios" || Platform.OS === "android";

export function tapHaptic(): void {
  if (!enabled) return;
  // Самый деликатный отклик на нажатие.
  Haptics.selectionAsync().catch(() => {});
}

export function resultHaptic(success: boolean): void {
  if (!enabled) return;
  // Мягкий импульс вместо «жужжащих» notification-сигналов.
  Haptics.impactAsync(
    success
      ? Haptics.ImpactFeedbackStyle.Light
      : Haptics.ImpactFeedbackStyle.Soft,
  ).catch(() => {});
}
