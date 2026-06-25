import { useRef, useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import AccountSheetContext from "../../context/account-sheet-context";
import AccountSheetContent from "../../components/account/account";
import { Easing } from "react-native-reanimated";
import { useBottomSheetTimingConfigs } from "@gorhom/bottom-sheet";

export default function TabsLayout() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["94%"], []);

  const openSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 350,
    easing: Easing.out(Easing.exp),
  });

  return (
    <AccountSheetContext.Provider value={{ openSheet }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#38a3a5",
          tabBarInactiveTintColor: "#AAAAAA",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#EEEEEE",
            height: 100,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="basket"
          options={{
            title: "Basket",
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "basket" : "basket-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="category/[slug]"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        handleComponent={() => null}
        animationConfigs={animationConfigs}
        backgroundStyle={{
          backgroundColor: "#f7f7f7",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <AccountSheetContent />
      </BottomSheetModal>
    </AccountSheetContext.Provider>
  );
}

const styles = StyleSheet.create({});
