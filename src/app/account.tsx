import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function AccountScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Account",
          headerBackTitle: "",
          headerBackVisible: true,
          headerTintColor: "#38a3a5",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontWeight: "700", color: "#1A1A1A" },
        }}
      />
      <View style={styles.container}>
        <Text style={styles.placeholder}>Account</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  placeholder: { fontSize: 18, color: "#999" },
});
