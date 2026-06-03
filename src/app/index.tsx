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
  ROUND_TIME_MS,
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
  const playing = phase === "main" || phase === "bonus";
  const hint = hintRow(state);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HUD автомата */}
        <Hud state={state} playing={playing} />

        {/* Экран автомата */}
        <View style={styles.screen}>
          {playing && state.round ? (
            <FigureView
              figure={state.round.screen}
              size={SCREEN_FIGURE_SIZE}
              color="#208AEF"
            />
          ) : (
            <ScreenMenu state={state} onStart={start} onProceed={proceed} />
          )}
        </View>

        {/* Клавиатура автомата */}
        <Keyboard playing={playing} hint={hint} onPress={press} />
      </SafeAreaView>
    </View>
  );
}

function Hud({
  state,
  playing,
}: {
  state: ReturnType<typeof useGame>["state"];
  playing: boolean;
}) {
  const isBonus = state.phase === "bonus";
  const timeLeft = playing ? state.roundTimeLeft : ROUND_TIME_MS;
  const figureRatio = playing ? state.figureTimeLeft / FIGURE_TIME_MS : 1;

  return (
    <View style={styles.hud}>
      <View style={styles.hudCell}>
        <Text style={styles.hudLabel}>Очки</Text>
        <Text style={styles.hudValue}>{state.score}</Text>
      </View>
      <View style={styles.hudCell}>
        <Text style={styles.hudLabel}>{isBonus ? "ПРИЗ" : "Время"}</Text>
        <Text style={styles.hudValue}>{formatTime(timeLeft)}</Text>
      </View>
      <FigureTimer remaining={figureRatio} count={FIGURE_TIMER_DOTS} />
      <Smiley mood={state.feedback} size={44} />
    </View>
  );
}

function ScreenMenu({
  state,
  onStart,
  onProceed,
}: {
  state: ReturnType<typeof useGame>["state"];
  onStart: () => void;
  onProceed: () => void;
}) {
  let title: string;
  let subtitle: string;
  let label: string;
  let onAction: () => void;

  if (state.phase === "result") {
    const prize = state.mainScore >= PRIZE_THRESHOLD;
    title = "Раунд окончен";
    subtitle = prize
      ? `${state.mainScore} очков — открыта призовая игра!`
      : `${state.mainScore} очков (нужно ${PRIZE_THRESHOLD} для приза)`;
    label = prize ? "Призовая игра" : "Завершить";
    onAction = onProceed;
  } else if (state.phase === "gameover") {
    title = "Игра окончена";
    subtitle = `Основной: ${state.mainScore}${
      state.bonusScore > 0 ? `   •   Призовой: ${state.bonusScore}` : ""
    }`;
    label = "Играть снова";
    onAction = onStart;
  } else {
    title = "ПАМЯТЬ";
    subtitle = "Дополни фигуру недостающей частью";
    label = "Играть";
    onAction = onStart;
  }

  return (
    <View style={styles.menu}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
      <Pressable style={styles.cta} onPress={onAction}>
        <Text style={styles.ctaText}>{label}</Text>
      </Pressable>
    </View>
  );
}

function Keyboard({
  playing,
  hint,
  onPress,
}: {
  playing: boolean;
  hint: number | null;
  onPress: (f: Figure) => void;
}) {
  return (
    <View style={styles.keyboard}>
      {rows.map((rowFigures, row) => {
        const highlighted = playing && hint === row;
        return (
          <View key={row} style={[styles.row, highlighted && styles.rowHint]}>
            {rowFigures.map((figure, col) => (
              <Pressable
                key={col}
                style={[styles.button, !playing && styles.buttonIdle]}
                disabled={!playing}
                onPress={() => onPress(figure)}
              >
                <FigureView
                  figure={figure}
                  size={BUTTON_SIZE}
                  color={playing ? "#333" : "#bbb"}
                />
              </Pressable>
            ))}
          </View>
        );
      })}
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
    alignSelf: "stretch",
    marginHorizontal: 16,
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F8FC",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D0DCE8",
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
  buttonIdle: {
    backgroundColor: "#f6f6f6",
    opacity: 0.6,
  },
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  menuTitle: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#0B3D66",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#5A6B7B",
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
