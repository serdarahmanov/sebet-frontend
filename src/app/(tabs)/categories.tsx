import { StyleSheet, View } from "react-native";
import Header from "../../components/header";
import CategoryGrid from "../../components/categories/category-grid";

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <CategoryGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
});
