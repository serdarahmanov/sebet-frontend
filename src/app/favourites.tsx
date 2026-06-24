import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function FavouritesScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Favourites",
          headerBackTitle: "",
          headerBackVisible: true,
          headerTintColor: "#38a3a5",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontWeight: "700", color: "#1A1A1A" },
        }}
      />
      <View style={styles.container}>
        <Text style={styles.placeholder}>No favourites yet.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  placeholder: { fontSize: 14, color: "#AAAAAA" },
});
