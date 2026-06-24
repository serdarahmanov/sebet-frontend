import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BasketCard, { BasketItem } from "../../components/basket/basket-card";
import PeopleAlsoAdded from "../../components/basket/people-also-added";
import SavingsAndOffers from "../../components/basket/savings-and-offers";
import Summary from "../../components/basket/summary";

const BASKET_ITEMS: BasketItem[] = [
  {
    id: "1",
    name: "Whole Milk",
    unit: "1L",
    price: 1.49,
    image: "https://placehold.co/120x120/F5F5F5/999?text=+",
    initialQty: 2,
  },
  {
    id: "2",
    name: "Seeded Whole Grain Sourdough Loaf",
    unit: "800g",
    price: 2.99,
    image: "https://placehold.co/120x120/F5F5F5/999?text=+",
    initialQty: 1,
  },
  {
    id: "3",
    name: "Lurpak Butter Spreadable",
    unit: "500g",
    price: 2.49,
    image: "https://placehold.co/120x120/F5F5F5/999?text=+",
    initialQty: 1,
  },
  {
    id: "4",
    name: "Organic Free-Range Large Eggs",
    unit: "12 pack",
    price: 3.29,
    image: "https://placehold.co/120x120/F5F5F5/999?text=+",
    initialQty: 1,
  },
  {
    id: "5",
    name: "Tropicana Orange Juice",
    unit: "1.4L",
    price: 1.99,
    image: "https://placehold.co/120x120/F5F5F5/999?text=+",
    initialQty: 3,
  },
];

const SUBTOTAL = 22.63;
const SAVINGS = 2.73;
const DELIVERY_FEE = 2;

function getPromoDiscount(promoCode: string, basketTotal: number) {
  switch (promoCode) {
    case "SAVE10":
      return Math.round(basketTotal * 0.1 * 100) / 100;
    case "WELCOME5":
      return Math.min(5, basketTotal);
    default:
      return 0;
  }
}

export default function BasketScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  const filtered = query.trim()
    ? BASKET_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : BASKET_ITEMS;

  const basketTotalAfterItemSavings = Math.max(0, SUBTOTAL - SAVINGS);
  const promoDiscount = getPromoDiscount(appliedPromo, basketTotalAfterItemSavings);
  const totalSavings = SAVINGS + promoDiscount;
  const deliveryFee = appliedPromo === "FREESHIP" ? 0 : DELIVERY_FEE;
  const orderTotal = Math.max(0, basketTotalAfterItemSavings - promoDiscount) + deliveryFee;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>My Basket</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 160 + insets.bottom }]}
      >
        <View style={styles.unavailableBox}>
          <View style={styles.unavailableText}>
            <Text style={styles.unavailableTitle}>If any items are unavailable</Text>
            <Text style={styles.unavailableSubtitle}>Remove if unavailable</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
          {/* Search bar */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={20} color="#AAAAAA" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search or add items…"
                placeholderTextColor="#AAAAAA"
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
          </View>

          <View style={styles.divider} />

          {filtered.map((item) => (
            <BasketCard key={item.id} item={item} />
          ))}
        </View>

        <PeopleAlsoAdded />
        <SavingsAndOffers appliedPromo={appliedPromo} onApplyPromo={setAppliedPromo} />
        <Summary
          subtotal={SUBTOTAL}
          savings={totalSavings}
          deliveryFee={deliveryFee}
          total={orderTotal}
        />
      </ScrollView>

      <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Order Total</Text>
          <Text style={styles.totalValue}>£{orderTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85}>
          <Text style={styles.checkoutText}>Go To Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  headerSpacer: {
    width: 26,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  unavailableBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  unavailableText: {
    gap: 3,
  },
  unavailableTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  unavailableSubtitle: {
    fontSize: 11,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  changeText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#38a3a5",
  },
  box: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  searchWrapper: {
    padding: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    padding: 0,
  },
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "400",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  checkoutBtn: {
    backgroundColor: "#38a3a5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
});
