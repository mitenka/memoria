import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FigureView from "@/components/FigureView";
import { rows } from "@/game/catalog";
import { DIAG1, DIAG2, FRAME } from "@/game/figures";

const BUTTON_SIZE = 38;
const SCREEN_FIGURE_SIZE = 140;

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Экран */}
        <View style={styles.screen}>
          <FigureView
            figure={FRAME | DIAG1 | DIAG2}
            size={SCREEN_FIGURE_SIZE}
            color="#4af"
          />
        </View>

        {/* 4 ряда × 8 кнопок */}
        <View style={styles.keyboard}>
          {rows.map((rowFigures, row) => (
            <View key={row} style={styles.row}>
              {rowFigures.map((figure, col) => (
                <Pressable key={col} style={styles.button} onPress={() => {}}>
                  <FigureView figure={figure} size={BUTTON_SIZE} color="#333" />
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </SafeAreaView>
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
  },
  button: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
});
