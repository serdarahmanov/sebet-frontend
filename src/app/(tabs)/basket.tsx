import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BASKETS,
  getBasketFulfillmentLabel,
  getBasketSubtotal,
  getOrderedBaskets,
} from "../../data/baskets";

// 6 circles must fit the available span.
// step = circleSize * STEP_RATIO
// totalWidth = circleSize + step * 5 = circleSize * (1 + STEP_RATIO * 5)
// → circleSize = containerWidth / (1 + STEP_RATIO * 5)
const STEP_RATIO = 0.82;
const SLOTS = 6; // the span is always sized for 6 circles
const MAX_VISIBLE_ITEMS = 5; // show 5 products + "+N" when items > 6
// Right margin reserves space equal to the trash button + a safe gap,
// so circles never visually reach the trash icon area.
const TRASH_RESERVE = 44;

export default function BasketsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [baskets, setBaskets] = useState(BASKETS);
  const orderedBaskets = getOrderedBaskets(baskets);
  const [containerWidths, setContainerWidths] = useState<Record<string, number>>({});

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>My Baskets</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
{orderedBaskets.map((basket) => {
          const subtotal = getBasketSubtotal(basket);
          const hasMore = basket.items.length > 6;
          const visibleItems = basket.items.slice(
            0,
            hasMore ? MAX_VISIBLE_ITEMS : basket.items.length,
          );
          const extraCount = hasMore ? basket.items.length - MAX_VISIBLE_ITEMS : 0;

          const containerWidth = containerWidths[basket.id] ?? 0;
          const circleSize =
            containerWidth > 0
              ? containerWidth / (1 + STEP_RATIO * (SLOTS - 1))
              : 0;
          const step = circleSize * STEP_RATIO;

          return (
            <View key={basket.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle}>
                  {getBasketFulfillmentLabel(basket)}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${getBasketFulfillmentLabel(basket)} basket`}
                  onPress={() =>
                    setBaskets((current) =>
                      current.filter((item) => item.id !== basket.id),
                    )
                  }
                >
                  <Ionicons name="trash-outline" size={24} color="#18C3B2" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/basket/[id]",
                    params: { id: basket.id },
                  })
                }
              >
                {/* marginRight reserves the trash icon column so circles never reach it */}
                <View
                  style={[styles.circlesContainer, { height: circleSize ? circleSize + 8 : 0 }]}
                  onLayout={(e: LayoutChangeEvent) => {
                    const width = e?.nativeEvent?.layout?.width;
                    if (width) {
                      setContainerWidths((prev) => ({
                        ...prev,
                        [basket.id]: width,
                      }));
                    }
                  }}
                >
                  {circleSize > 0 &&
                    visibleItems.map((item, index) => {
                      const qty = item.initialQty ?? 1;
                      return (
                        <View
                          key={item.id}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: index * step,
                            width: circleSize,
                            height: circleSize,
                            borderRadius: circleSize / 2,
                            backgroundColor: "#FFFFFF",
                            padding: 4,
                          }}
                        >
                          <Image
                            source={{ uri: item.image }}
                            resizeMode="contain"
                            style={[
                              styles.circle,
                              {
                                width: circleSize - 8,
                                height: circleSize - 8,
                                borderRadius: (circleSize - 8) / 2,
                              },
                            ]}
                          />
                          {qty > 1 && (
                            <View style={styles.qtyBadge}>
                              <Text style={styles.qtyBadgeText}>{qty}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  {circleSize > 0 && hasMore && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: MAX_VISIBLE_ITEMS * step,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        backgroundColor: "#FFFFFF",
                        padding: 4,
                      }}
                    >
                      <View
                        style={[
                          styles.circle,
                          styles.moreCircle,
                          {
                            width: circleSize - 8,
                            height: circleSize - 8,
                            borderRadius: (circleSize - 8) / 2,
                          },
                        ]}
                      >
                        <Text style={styles.moreText}>+{extraCount}</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.total}>£{(subtotal - basket.savings).toFixed(2)}</Text>
                  {basket.savings > 0 && (
                    <Text style={styles.originalPrice}>£{subtotal.toFixed(2)}</Text>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.footerLeft}>
                    <Text style={styles.itemCount}>
                      {basket.items.length}{" "}
                      {basket.items.length === 1 ? "item" : "items"}
                    </Text>
                    {basket.fulfillmentType === "now" && (
                      <>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.etaText}>30–40 min</Text>
                      </>
                    )}
                    {basket.fulfillmentType === "pickup" && (
                      <>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.etaText}>25–30 min</Text>
                      </>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="#38a3a5" />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    zIndex: 1,
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
  content: {
    padding: 16,
    gap: 12,
  },
card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#A8E6E0",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  circlesContainer: {
    marginTop: 16,
    marginRight: TRASH_RESERVE,
    position: "relative",
  },
  circle: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  qtyBadge: {
    position: "absolute",
    bottom: -5,
    right: 12,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  qtyBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0C5E55",
  },
  moreCircle: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0C5E55",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 14,
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0C5E55",
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: "400",
    color: "#0C5E55",
    textDecorationLine: "line-through",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemCount: {
    fontSize: 13,
    fontWeight: "400",
    color: "#18C3B2",
  },
  dot: {
    fontSize: 13,
    color: "#AAAAAA",
  },
  etaText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#AAAAAA",
  },
});
