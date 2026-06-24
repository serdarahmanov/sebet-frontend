import { View, Text, StyleSheet } from "react-native";

export default function BasketScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Basket</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  placeholder: { fontSize: 18, color: "#999" },
});
