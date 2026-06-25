import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CATEGORIES } from "../../../components/categories/category-grid";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const category = CATEGORIES.find((item) => item.slug === slug);

  if (!category) {
    return (
      <View style={[styles.container, styles.notFound]}>
        <Text style={styles.notFoundTitle}>Category not found</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>{category.name}</Text>
        <TouchableOpacity
          style={styles.searchButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Search in ${category.name}`}
        >
          <Ionicons name="search-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.hero}>
          {category.image ? (
            <Image source={category.image} style={styles.image} resizeMode="cover" />
          ) : (
            <Ionicons
              name={category.icon ?? "basket-outline"}
              size={88}
              color="#38a3a5"
            />
          )}
        </View>
        <Text style={styles.sectionTitle}>{category.name}</Text>
        <Text style={styles.emptyText}>
          Products in this category will appear here.
        </Text>
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
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
  },
  hero: {
    height: 190,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: "#777777",
  },
  notFound: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
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
