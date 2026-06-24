import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Category = {
  id: string;
  name: string;
  image: string;
};

const CATEGORIES: Category[] = [
  { id: "1",  name: "Vegetables",    image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "2",  name: "Fruit",         image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "3",  name: "Meat & Fish",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "4",  name: "Eggs & Dairy",  image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "5",  name: "Bakery",        image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "6",  name: "Frozen",        image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "7",  name: "Soft Drinks",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "8",  name: "Snacks",        image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "9",  name: "Ready Meals",   image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "10", name: "Cheese",        image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "11", name: "Household",     image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "12", name: "Baby",          image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
  { id: "13", name: "Pet",           image: "https://placehold.co/120x120/F5F5F5/999?text=+" },
];

const COLUMNS = 3;

function CategoryCard({ item }: { item: Category }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
}

export default function CategoryGrid() {
  const rows: Category[][] = [];
  for (let i = 0; i < CATEGORIES.length; i += COLUMNS) {
    rows.push(CATEGORIES.slice(i, i + COLUMNS));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
          {row.length < COLUMNS &&
            Array.from({ length: COLUMNS - row.length }).map((_, i) => (
              <View key={`spacer-${i}`} style={styles.card} />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  image: {
    width: "65%",
    aspectRatio: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 16,
  },
});
