import { useRef, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAccountSheet } from "../context/account-sheet-context";
import DeliveryPinIcon from "./svgs/location/delivery-pin-icon";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

type Address = {
  id: string;
  label?: string;
  street: string;
  city: string;
};

type SheetView = "addresses" | "new-address";

const ADDRESSES: Address[] = [
  { id: "1", label: "Home", street: "123 Main St", city: "New York, NY 10001" },
  { id: "2", street: "456 Oak Ave", city: "Brooklyn, NY 11201" },
  { id: "3", street: "789 Pine Rd", city: "Queens, NY 11354" },
  { id: "4", label: "Work", street: "321 Elm St", city: "Manhattan, NY 10036" },
];

function getHeaderText(address: Address): string {
  return address.label ?? address.street;
}

export default function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { openSheet } = useAccountSheet();
  const [selectedId, setSelectedId] = useState(ADDRESSES[0].id);
  const [pendingId, setPendingId] = useState(ADDRESSES[0].id);
  const [sheetView, setSheetView] = useState<SheetView>("addresses");

  const addressSheetRef = useRef<BottomSheetModal>(null);
  const mapSearchSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [mapSearchQuery, setMapSearchQuery] = useState("");

  const selectedAddress = ADDRESSES.find((a) => a.id === selectedId)!;
  const isNewAddress = sheetView === "new-address";

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
    ),
    []
  );

  function saveAddress() {
    setSelectedId(pendingId);
    addressSheetRef.current?.dismiss();
  }

  function openNewAddressView() {
    setSheetView("new-address");
  }

  function backToAddresses() {
    setSheetView("addresses");
  }

  function handleDismiss() {
    setSheetView("addresses");
  }

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.addressButton}
            onPress={() => {
              setPendingId(selectedId);
              addressSheetRef.current?.present();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.addressTextWrapper}>
              <Text style={styles.deliveringLabel}>Now</Text>
              <View style={styles.addressNameRow}>
                <Text style={styles.addressText} numberOfLines={1}>
                  {getHeaderText(selectedAddress)}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#666666" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => router.push("/favourites")}>
              <Ionicons name="heart-outline" size={22} color="#38a3a5" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={openSheet}>
              <Ionicons name="person" size={22} color="#38a3a5" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#AAAAAA" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#AAAAAA"
            returnKeyType="search"
          />
        </View>
      </View>

      <BottomSheetModal
        ref={addressSheetRef}
        snapPoints={snapPoints}
        index={0}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={!isNewAddress}
        enableContentPanningGesture={!isNewAddress}
        handleComponent={() => null}
        backgroundStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        onDismiss={handleDismiss}
      >
        <View style={styles.sheetInner}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity
              style={styles.sheetCloseButton}
              onPress={isNewAddress ? backToAddresses : () => addressSheetRef.current?.dismiss()}
              activeOpacity={0.7}
            >
              <Ionicons name={isNewAddress ? "chevron-back" : "close"} size={20} color="#1A1A1A" />
            </TouchableOpacity>
            {!isNewAddress && (
              <Text style={styles.sheetTitle}>Delivery Address</Text>
            )}
          </View>

          {isNewAddress ? (
            <>
              <View style={[styles.newAddressBody, styles.formBg]}>
                <Text style={styles.formHeading}>Which address are we delivering to?</Text>
                <View style={styles.mapContainer}>
                  <View style={styles.mapCenter}>
                    <View style={styles.mapCenterBox}>
                      <Text style={styles.mapCenterText}>Riders will travel to this spot</Text>
                    </View>
                    <DeliveryPinIcon size={48} />
                  </View>
                  <TouchableOpacity style={styles.mapZoomButton} activeOpacity={0.8} onPress={() => mapSearchSheetRef.current?.present()}>
                    <Ionicons name="search" size={20} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>

                <View style={styles.suggestionBlock}>
                  <Text style={styles.suggestionLabel}>Suggested delivery address</Text>
                  <Text style={styles.suggestionAddress}>W8RQ+R9 Ashgabat, Turkmenistan</Text>
                  <Text style={styles.suggestionHint}>Not accurate? You can refine this on the next screen</Text>
                </View>
              </View>

              <View style={[styles.saveButtonWrapper, styles.formBg, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity style={[styles.saveButton, { borderRadius: 4 }]} activeOpacity={0.8}>
                  <Text style={styles.saveButtonText}>Confirm Pin</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.addressSheetBody}>
              <BottomSheetScrollView style={styles.addressList} contentContainerStyle={styles.addressListContent}>

                <Text style={styles.sectionLabel}>Deliver to...</Text>
                <View style={[styles.addressGroup, styles.groupGap]}>
                  <TouchableOpacity
                    style={[styles.addressItem, styles.addressItemLast]}
                    activeOpacity={0.7}
                    onPress={openNewAddressView}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#38a3a5" />
                    <Text style={[styles.addressItemPrimary, styles.newAddressText, styles.flex1]}>New Address</Text>
                    <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.addressGroup, styles.sectionGap]}>
                  {ADDRESSES.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.addressItem,
                        index === ADDRESSES.length - 1 && styles.addressItemLast,
                      ]}
                      onPress={() => setPendingId(item.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="location-sharp" size={16} color="#AAAAAA" />
                      <View style={styles.addressTextBlock}>
                        <Text style={styles.addressItemPrimary}>
                          {item.label ?? item.street}
                        </Text>
                        <Text style={styles.addressItemSecondary}>
                          {item.label ? `${item.street}, ${item.city}` : item.city}
                        </Text>
                      </View>
                      <Ionicons
                        name={item.id === pendingId ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={item.id === pendingId ? "#38a3a5" : "#AAAAAA"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.sectionLabel, styles.sectionLabelGap]}>When?</Text>
                <View style={styles.addressGroup}>
                  <TouchableOpacity style={[styles.addressItem, styles.addressItemLast]} activeOpacity={0.7}>
                    <Ionicons name="time-outline" size={18} color="#AAAAAA" />
                    <Text style={[styles.addressItemPrimary, styles.flex1]}>Now</Text>
                    <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
                  </TouchableOpacity>
                </View>

              </BottomSheetScrollView>

              <View style={[styles.saveButtonWrapper, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity style={styles.saveButton} onPress={saveAddress} activeOpacity={0.8}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        ref={mapSearchSheetRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleComponent={() => null}
        backgroundStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      >
        <View style={styles.sheetInner}>
          <View style={styles.mapSearchHeader}>
            <TouchableOpacity onPress={() => mapSearchSheetRef.current?.dismiss()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.mapSearchBar}>
              <Ionicons name="search" size={22} color="#AAAAAA" />
              <TextInput
                style={styles.mapSearchInput}
                placeholder="Search for an address..."
                placeholderTextColor="#AAAAAA"
                value={mapSearchQuery}
                onChangeText={setMapSearchQuery}
                autoFocus
                returnKeyType="search"
              />
              {mapSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setMapSearchQuery("")} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={16} color="#AAAAAA" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.mapSearchBody}>
            <Ionicons name="search" size={40} color="#DDDDDD" />
            <Text style={styles.mapSearchPlaceholder}>Search for your address</Text>
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: "60%",
  },
  addressTextWrapper: {
    flexShrink: 1,
  },
  addressNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconGroup: {
    flexDirection: "row",
    gap: 8,
  },
  deliveringLabel: {
    fontSize: 13,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  addressText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF8F8",
    borderRadius: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    padding: 0,
  },
  sheetInner: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  sheetHeader: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#ffffff",
  },
  sheetCloseButton: {
    position: "absolute",
    left: 0,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  addressSheetBody: {
    flex: 1,
  },
  addressList: {
    flex: 1,
  },
  addressListContent: {
    padding: 16,
  },
  addressGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  groupGap: {
    marginBottom: 8,
  },
  sectionGap: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  sectionLabelGap: {
    marginTop: 4,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  addressItemLast: {
    borderBottomWidth: 0,
  },
  addressTextBlock: {
    flex: 1,
    gap: 2,
  },
  addressItemPrimary: {
    fontSize: 14,
    color: "#555555",
    fontWeight: "400",
  },
  addressItemSecondary: {
    fontSize: 12,
    color: "#777777",
    fontWeight: "400",
  },
  newAddressText: {
    color: "#555555",
    fontWeight: "400",
  },
  flex1: {
    flex: 1,
  },
  saveButtonWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  saveButton: {
    backgroundColor: "#38a3a5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  newAddressBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: -16,
    overflow: "hidden",
  },
  mapCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mapCenterBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "center",
    maxWidth: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapCenterText: {
    fontSize: 11,
    color: "#555555",
    fontWeight: "500",
    textAlign: "center",
  },
  mapZoomButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionBlock: {
    gap: 4,
  },
  suggestionLabel: {
    fontSize: 12,
    color: "#AAAAAA",
    fontWeight: "400",
  },
  suggestionAddress: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "400",
  },
  suggestionHint: {
    fontSize: 12,
    color: "#AAAAAA",
    fontWeight: "400",
  },
  mapSearchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  mapSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  mapSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    padding: 0,
  },
  mapSearchBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 280,
  },
  mapSearchPlaceholder: {
    fontSize: 15,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  formBg: {
    backgroundColor: "#FFFFFF",
  },
  formContent: {
    padding: 16,
    gap: 8,
  },
  formHeading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
    marginTop: 4,
  },
  formSectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#AAAAAA",
    marginBottom: 4,
    marginTop: 8,
  },
  formGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  formInput: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A1A",
  },
});
