import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  /** Доля оставшегося времени 0..1 */
  remaining: number;
  /** Количество точек */
  count: number;
}

// Ряд точек, гаснущих одна за другой по мере истечения времени фигуры.
export default function FigureTimer({ remaining, count }: Props) {
  const clamped = Math.max(0, Math.min(1, remaining));
  const lit = Math.ceil(clamped * count);
  const low = lit <= Math.ceil(count / 3);

  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => {
        const isLit = i < lit;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              isLit
                ? { backgroundColor: low ? "#F85149" : "#208AEF" }
                : styles.dotOff,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 1,
  },
  dotOff: {
    backgroundColor: "#E0E1E6",
  },
});
