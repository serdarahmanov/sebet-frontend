import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../../components/header";
import BuyItAgain from "../../components/home/buy-it-again";
import TodaysTopOffers from "../../components/home/todays-top-offers";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <BuyItAgain />
        <TodaysTopOffers />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
});
