import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/header";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Home</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholder: { fontSize: 18, color: "#999" },
});
