import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  unit: string;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Whole Milk",
    price: 1.49,
    image: "https://placehold.co/120x120/EFF8F8/38a3a5?text=Milk",
    unit: "1L",
  },
  {
    id: "2",
    name: "Seeded Whole Grain Sourdough Loaf",
    price: 2.99,
    originalPrice: 3.49,
    image: "https://placehold.co/120x120/EFF8F8/38a3a5?text=Bread",
    unit: "800g",
  },
  {
    id: "3",
    name: "Organic Free-Range Large Eggs",
    price: 3.29,
    image: "https://placehold.co/120x120/EFF8F8/38a3a5?text=Eggs",
    unit: "12 pack",
  },
  {
    id: "4",
    name: "Greek Yogurt",
    price: 1.89,
    originalPrice: 2.19,
    image: "https://placehold.co/120x120/EFF8F8/38a3a5?text=Yogurt",
    unit: "500g",
  },
  {
    id: "5",
    name: "Cheddar Cheese",
    price: 2.49,
    image: "https://placehold.co/120x120/EFF8F8/38a3a5?text=Cheese",
    unit: "400g",
  },
  {
    id: "6",
    name: "Orange Juice",
    price: 2.19,
    image: "https://placehold.co/120x120/EFF8F8/38a3a5?text=OJ",
    unit: "1L",
  },
];

const IMAGE_HEIGHT = 135;
const CONTROL_HEIGHT = 36;
const CONTROL_UPSHIFT = 8; // how far the control rides up into the image

function QuantityControl({
  qty,
  onAdd,
  onRemove,
  compact = false,
}: {
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  if (qty === 0) {
    return (
      <TouchableOpacity
        style={[styles.addButton, compact && styles.compactAddButton]}
        onPress={onAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={compact ? 19 : 22} color="#38a3a5" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.qtyControl, compact && styles.compactQtyControl]}>
      <TouchableOpacity
        style={[styles.qtyBtn, compact && styles.compactQtyBtn]}
        onPress={onRemove}
        activeOpacity={0.8}
      >
        <Ionicons
          name={qty === 1 ? "trash-outline" : "remove"}
          size={compact ? 17 : 20}
          color="#38a3a5"
        />
      </TouchableOpacity>
      <Text style={[styles.qtyText, compact && styles.compactQtyText]}>{qty}</Text>
      <TouchableOpacity
        style={[styles.qtyBtn, compact && styles.compactQtyBtn]}
        onPress={onAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={compact ? 17 : 20} color="#38a3a5" />
      </TouchableOpacity>
    </View>
  );
}

export function ProductCard({
  item,
  style,
  compact = false,
}: {
  item: Product;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}) {
  const [qty, setQty] = useState(0);
  const hasDiscount = item.originalPrice != null;

  return (
    <View style={[styles.card, style]}>
      {/* Image section with its own overflow clip for top corners */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image }}
          style={[styles.image, compact && styles.compactImage]}
          resizeMode="cover"
        />
      </View>

      {/* Card body */}
      <View style={[styles.cardBody, compact && styles.compactCardBody]}>
        <Text
          style={[styles.name, compact && styles.compactName]}
          numberOfLines={compact ? 2 : 3}
        >
          {item.name}
        </Text>

        {/* Unit slot: occupied only when there's a discount badge below */}
        <View style={styles.unitRow}>
          {hasDiscount && <Text style={styles.unit}>{item.unit}</Text>}
        </View>

        {/* Badge slot: badge when discounted, unit when not (sits close to price) */}
        <View style={styles.badgeRow}>
          {hasDiscount ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{Math.round((1 - item.price / item.originalPrice!) * 100)}% OFF
              </Text>
            </View>
          ) : (
            <Text style={styles.unit}>{item.unit}</Text>
          )}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>
              £{item.originalPrice!.toFixed(2)}
            </Text>
          )}
        </View>
      </View>

      {/* Quantity control floating at the image/body junction, centered */}
      <View style={[styles.qtyOverlay, compact && styles.compactQtyOverlay]}>
        <QuantityControl
          qty={qty}
          compact={compact}
          onAdd={() => setQty((q) => q + 1)}
          onRemove={() => setQty((q) => Math.max(0, q - 1))}
        />
      </View>
    </View>
  );
}

export default function BuyItAgain() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Buy It Again</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="arrow-forward" size={22} color="#38a3a5" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  separator: {
    width: 12,
  },
  card: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  imageWrapper: {
    overflow: "hidden",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
    backgroundColor: "#EFF8F8",
  },
  compactImage: {
    height: 118,
  },
  unitRow: {
    height: 16,
    justifyContent: "center",
  },
  badgeRow: {
    height: 20,
    justifyContent: "center",
  },
  discountBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E53935",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
  },
  cardBody: {
    padding: 12,
    paddingTop: CONTROL_HEIGHT / 2 - CONTROL_UPSHIFT + 4,
    gap: 4,
  },
  compactCardBody: {
    padding: 8,
    paddingTop: 14,
    gap: 3,
  },
  unit: {
    fontSize: 11,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 19,
    minHeight: 57,
  },
  compactName: {
    minHeight: 38,
    fontSize: 12,
    lineHeight: 17,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  originalPrice: {
    fontSize: 12,
    color: "#AAAAAA",
    textDecorationLine: "line-through",
  },
  qtyOverlay: {
    position: "absolute",
    top: IMAGE_HEIGHT - CONTROL_HEIGHT / 2 - CONTROL_UPSHIFT,
    left: 12,
    right: 12,
    alignItems: "flex-end",
    zIndex: 2,
  },
  compactQtyOverlay: {
    top: 94,
    left: 8,
    right: 8,
  },
  addButton: {
    width: CONTROL_HEIGHT,
    height: CONTROL_HEIGHT,
    borderRadius: CONTROL_HEIGHT / 2,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#D0E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  compactAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: CONTROL_HEIGHT / 2,
    borderWidth: 1.5,
    borderColor: "#D0E8E8",
    overflow: "hidden",
    height: CONTROL_HEIGHT,
    alignSelf: "stretch",
  },
  compactQtyControl: {
    height: 32,
    borderRadius: 16,
  },
  qtyBtn: {
    width: 44,
    height: CONTROL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  compactQtyBtn: {
    width: 30,
    height: 32,
  },
  qtyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  compactQtyText: {
    fontSize: 12,
  },
});
