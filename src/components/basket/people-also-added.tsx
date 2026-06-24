import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SuggestedItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
};

const SUGGESTIONS: SuggestedItem[] = [
  { id: "1", name: "Cheddar Cheese",      price: 2.49, unit: "400g",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "2", name: "Greek Yogurt",        price: 1.89, unit: "500g",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "3", name: "Pringles Original",   price: 1.50, unit: "200g",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "4", name: "Heinz Baked Beans",   price: 0.89, unit: "415g",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "5", name: "Cadbury Dairy Milk",  price: 1.25, unit: "200g",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "6", name: "Innocent Smoothie",   price: 2.00, unit: "750ml",  image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
];

function SuggestionCard({ item }: { item: SuggestedItem }) {
  const [added, setAdded] = useState(false);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.cardBody}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.unit}>{item.unit}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.addBtn, added && styles.addBtnActive]}
            onPress={() => setAdded((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons name={added ? "checkmark" : "add"} size={18} color={added ? "#fff" : "#38a3a5"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PeopleAlsoAdded() {
  return (
    <View style={styles.section}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>People Also Added</Text>
      </View>
      <FlatList
        data={SUGGESTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SuggestionCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginHorizontal: -16,
  },
  titleWrapper: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  card: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 100,
    backgroundColor: "#F5F5F5",
  },
  cardBody: {
    padding: 8,
    gap: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 16,
    minHeight: 32,
  },
  unit: {
    fontSize: 11,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D0E8E8",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnActive: {
    backgroundColor: "#38a3a5",
    borderColor: "#38a3a5",
  },
});
