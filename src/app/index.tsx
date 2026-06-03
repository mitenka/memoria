import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FigureTimer from "@/components/FigureTimer";
import FigureView from "@/components/FigureView";
import Smiley from "@/components/Smiley";
import { rows } from "@/game/catalog";
import {
  FIGURE_TIME_MS,
  FIGURE_TIMER_DOTS,
  PRIZE_THRESHOLD,
} from "@/game/config";
import { type Figure } from "@/game/figures";
import { hintRow } from "@/game/state";
import { useGame } from "@/game/useGame";

const BUTTON_SIZE = 38;
const SCREEN_FIGURE_SIZE = 140;

function formatTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function GameScreen() {
  const { state, start, press, proceed } = useGame();
  const { phase } = state;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {phase === "idle" && (
          <Overlay
            title="ПАМЯТЬ"
            subtitle="Дополни фигуру недостающей частью"
            actionLabel="Играть"
            onAction={start}
          />
        )}

        {phase === "result" && (
          <Overlay
            title="Раунд окончен"
            subtitle={
              state.mainScore >= PRIZE_THRESHOLD
                ? `${state.mainScore} очков — открыта призовая игра!`
                : `${state.mainScore} очков (нужно ${PRIZE_THRESHOLD} для приза)`
            }
            actionLabel={
              state.mainScore >= PRIZE_THRESHOLD ? "Призовая игра" : "Завершить"
            }
            onAction={proceed}
          />
        )}

        {phase === "gameover" && (
          <Overlay
            title="Игра окончена"
            subtitle={`Основной: ${state.mainScore}${
              state.bonusScore > 0 ? `   •   Призовой: ${state.bonusScore}` : ""
            }`}
            actionLabel="Играть снова"
            onAction={start}
          />
        )}

        {(phase === "main" || phase === "bonus") && state.round && (
          <PlayView state={state} press={press} />
        )}
      </SafeAreaView>
    </View>
  );
}

function PlayView({
  state,
  press,
}: {
  state: ReturnType<typeof useGame>["state"];
  press: (f: Figure) => void;
}) {
  const hint = hintRow(state);
  const isBonus = state.phase === "bonus";

  return (
    <>
      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudCell}>
          <Text style={styles.hudLabel}>Очки</Text>
          <Text style={styles.hudValue}>{state.score}</Text>
        </View>
        <View style={styles.hudCell}>
          <Text style={styles.hudLabel}>{isBonus ? "ПРИЗ" : "Время"}</Text>
          <Text style={styles.hudValue}>{formatTime(state.roundTimeLeft)}</Text>
        </View>
        <FigureTimer
          remaining={state.figureTimeLeft / FIGURE_TIME_MS}
          count={FIGURE_TIMER_DOTS}
        />
        <Smiley mood={state.feedback} size={44} />
      </View>

      {/* Экран с недостающей фигурой */}
      <View style={styles.screen}>
        <FigureView
          figure={state.round!.screen}
          size={SCREEN_FIGURE_SIZE}
          color="#208AEF"
        />
      </View>

      {/* 4 ряда × 8 кнопок */}
      <View style={styles.keyboard}>
        {rows.map((rowFigures, row) => {
          const highlighted = hint === row;
          return (
            <View key={row} style={[styles.row, highlighted && styles.rowHint]}>
              {rowFigures.map((figure, col) => (
                <Pressable
                  key={col}
                  style={styles.button}
                  onPress={() => press(figure)}
                >
                  <FigureView figure={figure} size={BUTTON_SIZE} color="#333" />
                </Pressable>
              ))}
            </View>
          );
        })}
      </View>
    </>
  );
}

function Overlay({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.overlay}>
      <Text style={styles.overlayTitle}>{title}</Text>
      <Text style={styles.overlaySubtitle}>{subtitle}</Text>
      <Pressable style={styles.cta} onPress={onAction}>
        <Text style={styles.ctaText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 24,
  },
  hud: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  hudCell: {
    alignItems: "center",
  },
  hudLabel: {
    fontSize: 11,
    color: "#60646C",
    letterSpacing: 1,
  },
  hudValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    fontVariant: ["tabular-nums"],
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboard: {
    gap: 8,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 10,
  },
  rowHint: {
    backgroundColor: "#DCEBFF",
  },
  button: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  overlayTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#000",
  },
  overlaySubtitle: {
    fontSize: 15,
    color: "#60646C",
    textAlign: "center",
  },
  cta: {
    marginTop: 16,
    backgroundColor: "#208AEF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
