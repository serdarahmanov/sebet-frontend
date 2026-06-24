import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Saving = {
  id: string;
  label: string;
  amount: number;
};

const SAVINGS: Saving[] = [
  { id: "1", label: "Any 3 for £5 (Tropicana OJ)", amount: 0.97 },
  { id: "2", label: "£1.76 off Lurpak Butter", amount: 1.76 },
];

const PROMO_CODES = [
  { code: "SAVE10", description: "Save 10% on your basket" },
  { code: "WELCOME5", description: "Save £5 on your first order" },
  { code: "FREESHIP", description: "Free delivery on this order" },
];

type SavingsAndOffersProps = {
  appliedPromo: string;
  onApplyPromo: (promoCode: string) => void;
};

export default function SavingsAndOffers({
  appliedPromo,
  onApplyPromo,
}: SavingsAndOffersProps) {
  const insets = useSafeAreaInsets();
  const [promo, setPromo] = useState(appliedPromo);
  const total = SAVINGS.reduce((sum, s) => sum + s.amount, 0).toFixed(2);

  const sheetRef = useRef<BottomSheetModal>(null);
  const promoEntrySheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useCallback(() => ["90%"], []);

  function openSheet() {
    setPromo(appliedPromo);
    sheetRef.current?.present();
  }

  function openPromoEntrySheet() {
    promoEntrySheetRef.current?.present();
  }

  function closePromoSheet() {
    sheetRef.current?.dismiss();
  }

  function closePromoEntrySheet() {
    promoEntrySheetRef.current?.dismiss();
  }

  function confirmCustomPromo() {
    if (promo.trim().length === 0) return;
    setPromo(promo.trim().toUpperCase());
    promoEntrySheetRef.current?.dismiss();
  }

  function handleApply() {
    onApplyPromo(promo.trim().toUpperCase());
    sheetRef.current?.dismiss();
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Savings & Offers</Text>
      <View style={styles.box}>
        <View style={styles.row}>
          <Ionicons name="pricetag-outline" size={20} color="#38a3a5" />
          <View style={styles.itemSavingText}>
            <Text style={styles.itemSavingMain}>£{total} saved in items</Text>
            <Text style={styles.itemSavingSub}>Applied to your item prices</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.promoRow} activeOpacity={0.7} onPress={openSheet}>
          <Ionicons name="ticket-outline" size={20} color="#AAAAAA" />
          <Text style={[styles.promoLabel, appliedPromo ? styles.promoLabelActive : null]}>
            {appliedPromo ? appliedPromo : "Enter a promo code"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
        </TouchableOpacity>
      </View>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints()}
        enableDynamicSizing={false}
        enablePanDownToClose
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
        )}
      >
        <View style={styles.sheetInner}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={closePromoSheet}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Which promocode do you want to apply?</Text>
              <View style={styles.headerSpacer} />
            </View>
            <TouchableOpacity
              style={styles.promoEntryButton}
              activeOpacity={0.7}
              onPress={openPromoEntrySheet}
            >
              <Ionicons name="add" size={22} color="#38a3a5" />
              <Text style={styles.promoEntryButtonText}>
                {promo && !PROMO_CODES.some((item) => item.code === promo)
                  ? promo
                  : "Enter a promo code"}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#AAAAAA" />
            </TouchableOpacity>
            <Text style={styles.sheetSubtitle}>Or choose an available offer</Text>
            <View style={styles.promoOptions}>
              {PROMO_CODES.map((item, index) => {
                const isSelected = promo === item.code;

                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.promoOption,
                      index === PROMO_CODES.length - 1 && styles.promoOptionLast,
                      isSelected && styles.promoOptionSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setPromo(isSelected ? "" : item.code)}
                  >
                    <View style={styles.promoOptionText}>
                      <Text style={styles.promoOptionCode}>{item.code}</Text>
                      <Text style={styles.promoOptionDescription}>{item.description}</Text>
                    </View>
                    <Ionicons
                      name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                      size={22}
                      color={isSelected ? "#38a3a5" : "#C7C7C7"}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={[styles.applyButtonWrapper, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity
              style={styles.applyBtn}
              activeOpacity={0.85}
              onPress={handleApply}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        ref={promoEntrySheetRef}
        snapPoints={snapPoints()}
        stackBehavior="push"
        enableDynamicSizing={false}
        enablePanDownToClose
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
        )}
      >
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={closePromoEntrySheet}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Enter promo code</Text>
            <TouchableOpacity
              style={styles.claimButton}
              activeOpacity={0.7}
              onPress={confirmCustomPromo}
              disabled={promo.trim().length === 0}
              accessibilityRole="button"
              accessibilityLabel="Claim promo code"
            >
              <Text
                style={[
                  styles.claimButtonText,
                  promo.trim().length === 0 && styles.claimButtonTextDisabled,
                ]}
              >
                Claim
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="ticket-outline" size={20} color="#AAAAAA" />
            <BottomSheetTextInput
              style={styles.sheetInput}
              placeholder="e.g. SAVE10"
              placeholderTextColor="#AAAAAA"
              value={promo}
              onChangeText={setPromo}
              autoCapitalize="characters"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={promo.trim().length > 0 ? confirmCustomPromo : undefined}
            />
            {promo.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPromo("")}
                accessibilityRole="button"
                accessibilityLabel="Clear promo code"
              >
                <Ionicons name="close-circle" size={20} color="#AAAAAA" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.entryHint}>Press Done on the keyboard to select this code.</Text>
        </View>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  itemSavingText: {
    flex: 1,
    gap: 2,
  },
  itemSavingMain: {
    fontSize: 15,
    fontWeight: "400",
    color: "#1A1A1A",
  },
  itemSavingSub: {
    fontSize: 11,
    fontWeight: "400",
    color: "#AAAAAA",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  promoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  promoLabel: {
    flex: 1,
    fontSize: 14,
    color: "#AAAAAA",
  },
  promoLabelActive: {
    color: "#1A1A1A",
    fontWeight: "500",
  },
  claimBtn: {
    fontSize: 13,
    fontWeight: "600",
    color: "#38a3a5",
  },
  sheetBg: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    backgroundColor: "#E0E0E0",
    width: 36,
  },
  sheetInner: {
    flex: 1,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 16,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  claimButton: {
    minWidth: 56,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#38a3a5",
  },
  claimButtonTextDisabled: {
    color: "#AAAAAA",
  },
  sheetSubtitle: {
    marginTop: -8,
    fontSize: 13,
    color: "#777777",
    textAlign: "center",
  },
  promoOptions: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 12,
    overflow: "hidden",
  },
  promoOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  promoOptionLast: {
    borderBottomWidth: 0,
  },
  promoOptionSelected: {
    backgroundColor: "#F2FAFA",
  },
  promoOptionText: {
    flex: 1,
    gap: 3,
  },
  promoOptionCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  promoOptionDescription: {
    fontSize: 12,
    color: "#777777",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  promoEntryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  promoEntryButtonText: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
  },
  entryHint: {
    fontSize: 12,
    color: "#777777",
    textAlign: "center",
  },
  sheetInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    padding: 0,
  },
  applyBtn: {
    backgroundColor: "#38a3a5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyButtonWrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
