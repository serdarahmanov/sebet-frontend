import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  BottomSheetView,
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type SheetView = "account" | "orders";

type MenuItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  view?: SheetView;
  href?: string;
};

const MENU_GROUPS: MenuItem[][] = [
  [
    { label: "Orders", icon: "receipt-outline", view: "orders" },
    { label: "Favourites", icon: "heart-outline", href: "/favourites" },
  ],
  [
    { label: "Manage Account", icon: "settings-outline" },
    { label: "Payment Methods", icon: "card-outline" },
    { label: "Addresses", icon: "location-outline" },
  ],
  [
    { label: "Language", icon: "globe-outline" },
    { label: "Help", icon: "headset-outline" },
    { label: "Contact Preferences", icon: "notifications-outline" },
  ],
  [
    { label: "Vouchers and Credit", icon: "pricetag-outline" },
    { label: "FAQs", icon: "help-circle-outline" },
    { label: "About", icon: "information-circle-outline" },
  ],
];

function UserCard() {
  return (
    <View style={styles.userCard}>
      <View style={styles.userAvatar}>
        <Ionicons name="person" size={26} color="#38a3a5" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@email.com</Text>
      </View>
      <View style={styles.bonusBadge}>
        <Ionicons name="star" size={14} color="#F59E0B" />
        <Text style={styles.bonusText}>1,240 pts</Text>
      </View>
    </View>
  );
}

function AccountView({
  onNavigate,
  onHref,
}: {
  onNavigate: (view: SheetView) => void;
  onHref: (href: string) => void;
}) {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.body} style={styles.scrollView}>
      <UserCard />
      {MENU_GROUPS.map((group, groupIndex) => (
        <View
          key={groupIndex}
          style={[styles.group, groupIndex < MENU_GROUPS.length - 1 && styles.groupGap]}
        >
          {group.map((item, itemIndex) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, itemIndex === group.length - 1 && styles.menuRowLast]}
              onPress={() => {
                if (item.view) onNavigate(item.view);
                else if (item.href) onHref(item.href);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={20} color="#1A1A1A" />
              <Text style={styles.menuRowText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </BottomSheetScrollView>
  );
}

function OrdersView() {
  return (
    <View style={styles.body}>
      <Text style={styles.placeholder}>No orders yet.</Text>
    </View>
  );
}

export default function AccountSheetContent() {
  const { dismiss } = useBottomSheetModal();
  const router = useRouter();
  const [view, setView] = useState<SheetView>("account");

  const isOrders = view === "orders";

  function handleHref(href: string) {
    dismiss();
    router.push(href as any);
  }

  return (
    <BottomSheetView style={styles.sheetContent}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={isOrders ? () => setView("account") : () => dismiss()}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isOrders ? "chevron-back" : "close"}
            size={20}
            color="#1A1A1A"
          />
        </TouchableOpacity>
        <Text style={styles.sheetTitle}>{isOrders ? "Orders" : "Account"}</Text>
      </View>

      {isOrders ? <OrdersView /> : <AccountView onNavigate={setView} onHref={handleHref} />}
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  sheetContent: {

     flex: 1,
  backgroundColor: "#f7f7f7",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#ffffff",
      borderTopLeftRadius: 10,
  borderTopRightRadius: 10,

  },
  leftButton: {
    position: "absolute",
    left: 0,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  scrollView: {
    backgroundColor: "transparent",
  },
  body: {
   
    padding: 16,
    gap: 8,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EFF8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  userEmail: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  bonusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFBEB",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  bonusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
  },
  group: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  groupGap: {
    marginBottom: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  
  menuRowText: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },


  placeholder: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 32,
  },
});
