import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BasketCard from "../../components/basket/basket-card";
import PeopleAlsoAdded from "../../components/basket/people-also-added";
import SavingsAndOffers from "../../components/basket/savings-and-offers";
import Summary from "../../components/basket/summary";
import {
  getBasketById,
  getBasketFulfillmentLabel,
  getBasketSubtotal,
} from "../../data/baskets";

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

export default function BasketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const basket = getBasketById(id);
  const [query, setQuery] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  if (!basket) {
    return (
      <View style={[styles.notFound, { paddingTop: insets.top }]}>
        <Ionicons name="basket-outline" size={44} color="#AAAAAA" />
        <Text style={styles.notFoundTitle}>Basket not found</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filtered = query.trim()
    ? basket.items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      )
    : basket.items;

  const subtotal = getBasketSubtotal(basket);
  const afterSavings = Math.max(0, subtotal - basket.savings);
  const promoDiscount = getPromoDiscount(appliedPromo, afterSavings);
  const totalSavings = basket.savings + promoDiscount;
  const deliveryFee = appliedPromo === "FREESHIP" ? 0 : basket.deliveryFee;
  const promoSavings =
    appliedPromo === "FREESHIP" ? basket.deliveryFee : promoDiscount;
  const orderTotal =
    Math.max(0, afterSavings - promoDiscount) + deliveryFee;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>{getBasketFulfillmentLabel(basket)}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 160 + insets.bottom },
        ]}
      >
        <View style={styles.unavailableBox}>
          <View style={styles.unavailableText}>
            <Text style={styles.unavailableTitle}>
              If any items are unavailable
            </Text>
            <Text style={styles.unavailableSubtitle}>
              Remove if unavailable
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
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
        <SavingsAndOffers
          appliedPromo={appliedPromo}
          promoSavings={promoSavings}
          onApplyPromo={setAppliedPromo}
        />
        <Summary
          subtotal={subtotal}
          savings={totalSavings}
          deliveryFee={deliveryFee}
          originalDeliveryFee={basket.deliveryFee}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitleGroup: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  headerSpacer: {
    width: 26,
  },
  scroll: {
    padding: 16,
  },
  unavailableBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
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
    color: "#38a3a5",
  },
  box: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
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
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  checkoutBar: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#FFFFFF",
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
    color: "#FFFFFF",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#F5F5F5",
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  backLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#38a3a5",
  },
});
