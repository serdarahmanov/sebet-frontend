import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PromoKind = "percent" | "multibuy" | "saving";

type Offer = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  unit: string;
  unitPrice: string;
  promoKind: PromoKind;
  promoLabel: string;
};

const IMAGE_HEIGHT = 120;
const CONTROL_HEIGHT = 36;
const CONTROL_UPSHIFT = 8;

const OFFERS: Offer[] = [
  {
    id: "1",
    name: "Tropicana Orange Juice",
    price: 1.99,
    originalPrice: 3.49,
    image: "https://placehold.co/120x120/FFF8EE/F59E0B?text=OJ",
    unit: "1.4L",
    unitPrice: "£1.42/L",
    promoKind: "multibuy",
    promoLabel: "Any 3 for £5",
  },
  {
    id: "2",
    name: "Lurpak Butter Spreadable",
    price: 2.49,
    originalPrice: 4.25,
    image: "https://placehold.co/120x120/FFF8EE/F59E0B?text=Butter",
    unit: "500g",
    unitPrice: "£4.98/kg",
    promoKind: "saving",
    promoLabel: "£1.76 off",
  },
  {
    id: "3",
    name: "Cadbury Dairy Milk",
    price: 1.25,
    originalPrice: 2.00,
    image: "https://placehold.co/120x120/FFF8EE/F59E0B?text=Choc",
    unit: "200g",
    unitPrice: "£6.25/kg",
    promoKind: "percent",
    promoLabel: "38% OFF",
  },
  {
    id: "4",
    name: "Heinz Baked Beans",
    price: 0.89,
    originalPrice: 1.35,
    image: "https://placehold.co/120x120/FFF8EE/F59E0B?text=Beans",
    unit: "415g",
    unitPrice: "£2.15/kg",
    promoKind: "multibuy",
    promoLabel: "2 for £1.50",
  },
  {
    id: "5",
    name: "Innocent Smoothie Mango & Passion Fruit",
    price: 2.00,
    originalPrice: 3.00,
    image: "https://placehold.co/120x120/FFF8EE/F59E0B?text=Smoothie",
    unit: "750ml",
    unitPrice: "£2.67/L",
    promoKind: "saving",
    promoLabel: "£1.00 off",
  },
  {
    id: "6",
    name: "Pringles Original",
    price: 1.50,
    originalPrice: 2.29,
    image: "https://placehold.co/120x120/FFF8EE/F59E0B?text=Pringles",
    unit: "200g",
    unitPrice: "£7.50/kg",
    promoKind: "percent",
    promoLabel: "34% OFF",
  },
];

function QuantityControl({
  qty,
  onAdd,
  onRemove,
}: {
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  if (qty === 0) {
    return (
      <TouchableOpacity style={styles.addButton} onPress={onAdd} activeOpacity={0.8}>
        <Ionicons name="add" size={22} color="#38a3a5" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.qtyControl}>
      <TouchableOpacity style={styles.qtyBtn} onPress={onRemove} activeOpacity={0.8}>
        <Ionicons name={qty === 1 ? "trash-outline" : "remove"} size={20} color="#38a3a5" />
      </TouchableOpacity>
      <Text style={styles.qtyText}>{qty}</Text>
      <TouchableOpacity style={styles.qtyBtn} onPress={onAdd} activeOpacity={0.8}>
        <Ionicons name="add" size={20} color="#38a3a5" />
      </TouchableOpacity>
    </View>
  );
}

function OfferCard({ item }: { item: Offer }) {
  const [qty, setQty] = useState(0);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.unitRow}>
          <Text style={styles.unit}>{item.unit}</Text>
          <Text style={styles.unit}>-</Text>
          <Text style={styles.unitPrice}>{item.unitPrice}</Text>
        </View>
        <View style={styles.priceRow}>
          {item.promoKind === "multibuy" ? (
            <Text style={styles.price}>£{item.originalPrice.toFixed(2)}</Text>
          ) : (
            <>
              <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>£{item.originalPrice.toFixed(2)}</Text>
            </>
          )}
        </View>
        <Text style={styles.promoText}>{item.promoLabel}</Text>
      </View>

      <View style={styles.qtyOverlay}>
        <QuantityControl
          qty={qty}
          onAdd={() => setQty((q) => q + 1)}
          onRemove={() => setQty((q) => Math.max(0, q - 1))}
        />
      </View>
    </View>
  );
}

export default function TodaysTopOffers() {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Top Offers</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="arrow-forward" size={22} color="#38a3a5" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={OFFERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OfferCard item={item} />}
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
    paddingTop: 28,
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
    backgroundColor: "#FFF8EE",
  },
  qtyOverlay: {
    position: "absolute",
    top: IMAGE_HEIGHT - CONTROL_HEIGHT / 2 - CONTROL_UPSHIFT,
    left: 12,
    right: 12,
    alignItems: "flex-end",
    zIndex: 2,
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
  cardBody: {
    padding: 10,
    paddingTop: CONTROL_HEIGHT / 2 - CONTROL_UPSHIFT + 4,
    gap: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
    minHeight: 36,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unit: {
    fontSize: 11,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  unitPrice: {
    fontSize: 11,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  promoText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#38a3a5",
  },
});
