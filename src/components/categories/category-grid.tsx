import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export type Category = {
  id: string;
  slug: string;
  name: string;
  image: ImageSourcePropType;
};

export const CATEGORIES: Category[] = [
  { id: "1", slug: "vegetables", name: "Vegetables", image: require("../../../public/categories/category thumbnails/Vegs.webp") },
  { id: "2", slug: "fruit", name: "Fruit", image: require("../../../public/categories/category thumbnails/Fruits.webp") },
  { id: "3", slug: "meat-and-fish", name: "Meat & Fish", image: require("../../../public/categories/category thumbnails/Fish and Meat.webp") },
  { id: "4", slug: "eggs-and-dairy", name: "Eggs & Dairy", image: require("../../../public/categories/category thumbnails/Dairy & eggs.webp") },
  { id: "5", slug: "bakery", name: "Bakery", image: require("../../../public/categories/category thumbnails/Bakery.webp") },
  { id: "6", slug: "frozen", name: "Frozen", image: require("../../../public/categories/category thumbnails/Frozen.webp") },
  { id: "7", slug: "soft-drinks", name: "Soft Drinks", image: require("../../../public/categories/category thumbnails/Soft Drinks.webp") },
  { id: "8", slug: "snacks", name: "Snacks", image: require("../../../public/categories/category thumbnails/Snacks.webp") },
  { id: "9", slug: "ready-meals", name: "Ready Meals", image: require("../../../public/categories/category thumbnails/Ready Food.webp") },
  { id: "10", slug: "cheese", name: "Cheese", image: require("../../../public/categories/category thumbnails/Cheese.webp") },
  { id: "11", slug: "household", name: "Household", image: require("../../../public/categories/category thumbnails/Cleaning.webp") },
  { id: "12", slug: "baby", name: "Baby", image: require("../../../public/categories/category thumbnails/Baby.webp") },
  { id: "13", slug: "pet", name: "Pet", image: require("../../../public/categories/category thumbnails/Pet.webp") },
  { id: "14", slug: "health-and-beauty", name: "Health & Beauty", image: require("../../../public/categories/category thumbnails/Health and  Beauty.webp") },
  { id: "15", slug: "jam-honey-and-spreads", name: "Jam, Honey, Spreads", image: require("../../../public/categories/category thumbnails/Jams , honey , speards.webp") },
  { id: "16", slug: "tea-coffee-and-hot-drinks", name: "Tea, Coffee, Hot Drinks", image: require("../../../public/categories/category thumbnails/Tea & Coffee.webp") },
  { id: "17", slug: "rice-pasta-and-noodles", name: "Rice, Pasta, Noodles", image: require("../../../public/categories/category thumbnails/rice , pasta.webp") },
  { id: "18", slug: "sugar-flour-and-baking", name: "Sugar, Flour, Baking", image: require("../../../public/categories/category thumbnails/Sugar, Flour, Baking.webp") },
  { id: "19", slug: "ice-cream", name: "Ice Cream", image: require("../../../public/categories/category thumbnails/ice cream.webp") },
  { id: "20", slug: "desserts", name: "Desserts", image: require("../../../public/categories/category thumbnails/Desserts.webp") },
  { id: "21", slug: "crisps-snacks-and-biscuits", name: "Crisps, Snacks, Biscuits", image: require("../../../public/categories/category thumbnails/Crisp and bisquites.webp") },
  { id: "22", slug: "cooking-sauces-and-ingredients", name: "Cooking Sauces & Ingredients", image: require("../../../public/categories/category thumbnails/Sauces and oils.webp") },
  { id: "23", slug: "table-sauces-and-condiments", name: "Table Sauces & Condiments", image: require("../../../public/categories/category thumbnails/Table Sauces & Condiments.webp") },
  { id: "24", slug: "cans-and-tins", name: "Cans & Tins", image: require("../../../public/categories/category thumbnails/Cans & Tins.webp") },
  { id: "25", slug: "cereal-and-cereal-bars", name: "Cereal & Cereal Bars", image: require("../../../public/categories/category thumbnails/Cereals.webp") },
  { id: "26", slug: "spices", name: "Spices", image: require("../../../public/categories/category thumbnails/Spices.webp") },
];

const COLUMNS = 3;

function CategoryCard({ item }: { item: Category }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() =>
        router.push({
          pathname: "/category/[slug]",
          params: { slug: item.slug },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.name} category`}
    >
      <View style={styles.imageFrame}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.labelFrame}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CategoryGrid() {
  const rows: Category[][] = [];
  for (let i = 0; i < CATEGORIES.length; i += COLUMNS) {
    rows.push(CATEGORIES.slice(i, i + COLUMNS));
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.grid}
    >
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
          {row.length < COLUMNS &&
            Array.from({ length: COLUMNS - row.length }).map((_, i) => (
              <View key={`spacer-${i}`} style={styles.spacer} />
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 12,
    paddingBottom: 24,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: 0,
    height: 142,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 10,
    overflow: "hidden",
  },
  spacer: {
    flex: 1,
    minWidth: 0,
  },
  imageFrame: {
    height: 104,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  labelFrame: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: "#F4F4F4",
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 16,
  },
});
