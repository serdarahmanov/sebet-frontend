import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CONTROL_HEIGHT = 36;

export type BasketItem = {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  initialQty?: number;
};

export default function BasketCard({ item }: { item: BasketItem }) {
  const [qty, setQty] = useState(item.initialQty ?? 1);

  const total = (item.price * qty).toFixed(2);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty((q) => Math.max(1, q - 1))}
              activeOpacity={0.8}
            >
              <Ionicons
                name={qty === 1 ? "trash-outline" : "remove"}
                size={20}
                color="#38a3a5"
              />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{qty}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty((q) => q + 1)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#38a3a5" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.unit}>{item.unit}</Text>
        <Text style={styles.total}>£{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
  },
  body: {
    flex: 1,
    gap: 4,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 19,
  },
  unit: {
    fontSize: 12,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#D0E8E8",
    borderRadius: CONTROL_HEIGHT / 2,
    overflow: "hidden",
    height: CONTROL_HEIGHT,
    width: 100,
  },
  qtyBtn: {
    width: 44,
    height: CONTROL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  total: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});
