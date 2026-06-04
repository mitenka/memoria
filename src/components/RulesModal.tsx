import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FigureView from "@/components/FigureView";
import { PRIZE_THRESHOLD } from "@/game/config";
import { ALL, DIAG2, subtract, type Figure } from "@/game/figures";

// Иллюстрация правила «достраивания»:
// фигура на экране + ответ = полная фигура.
const FULL: Figure = ALL;
const ANSWER: Figure = DIAG2;
const SCREEN: Figure = subtract(FULL, ANSWER);

const RULES: { lead: string; text: string }[] = [
  {
    lead: "Beat the clock",
    text: "You have two minutes. Each figure also has its own short timer.",
  },
  {
    lead: "Complete the figure",
    text: "Every figure on the screen is missing a piece. Tap the button that fills the gap — screen plus answer makes the full figure.",
  },
  {
    lead: "Follow the hint",
    text: "The highlighted row points to where the correct answer waits.",
  },
  {
    lead: "Unlock the prize round",
    text: `Score ${PRIZE_THRESHOLD} points to open the prize round — played without hints.`,
  },
];

export default function RulesModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <SafeAreaView edges={["top", "bottom"]} style={styles.cardInner}>
            <View style={styles.header}>
              <Text style={styles.title}>How to play</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.close,
                  pressed && styles.closePressed,
                ]}
                hitSlop={10}
                onPress={onClose}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
            >
              {/* Иллюстрация: экран + ответ = полная фигура */}
              <View style={styles.equation}>
                <Term figure={SCREEN} label="On screen" />
                <Text style={styles.operator}>+</Text>
                <Term figure={ANSWER} label="Answer" color="#208AEF" />
                <Text style={styles.operator}>=</Text>
                <Term figure={FULL} label="Full figure" />
              </View>

              {/* Правила */}
              <View style={styles.rules}>
                {RULES.map((rule, i) => (
                  <View key={i} style={styles.rule}>
                    <Text style={styles.ruleIndex}>{i + 1}</Text>
                    <Text style={styles.ruleText}>
                      <Text style={styles.ruleLead}>{rule.lead}. </Text>
                      {rule.text}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

function Term({
  figure,
  label,
  color = "#0B3D66",
}: {
  figure: Figure;
  label: string;
  color?: string;
}) {
  return (
    <View style={styles.term}>
      <View style={styles.termTile}>
        <FigureView figure={figure} size={44} color={color} />
      </View>
      <Text style={styles.termLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(11, 61, 102, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
  },
  cardInner: {
    flexShrink: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#0B3D66",
  },
  close: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#F3F6FA",
  },
  closePressed: {
    opacity: 0.6,
  },
  closeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5A6B7B",
  },
  body: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
  },
  equation: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#F4F8FC",
    borderRadius: 18,
  },
  term: {
    alignItems: "center",
    gap: 6,
  },
  termTile: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D7DEE7",
  },
  termLabel: {
    fontSize: 10,
    color: "#8A909A",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  operator: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8A909A",
    height: 56,
    lineHeight: 56,
    textAlignVertical: "center",
  },
  rules: {
    gap: 16,
  },
  rule: {
    flexDirection: "row",
    gap: 12,
  },
  ruleIndex: {
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 13,
    fontWeight: "800",
    color: "#208AEF",
    backgroundColor: "#E8F2FD",
    borderRadius: 12,
    overflow: "hidden",
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#5A6B7B",
  },
  ruleLead: {
    fontWeight: "700",
    color: "#0B3D66",
  },
});
