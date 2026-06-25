import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CATEGORIES } from "../../components/categories/category-grid";
import {
  Product,
  ProductCard,
} from "../../components/home/buy-it-again";

type FruitSection = {
  id: string;
  title: string;
  items: Product[];
};

type CategoryLink = {
  name: string;
  slug: string;
};

function fruitProduct(
  id: string,
  name: string,
  price: number,
  unit: string,
  color: string,
  label: string,
  originalPrice?: number,
): Product {
  return {
    id,
    name,
    price,
    originalPrice,
    unit,
    image: `https://placehold.co/240x240/${color}/333333?text=${encodeURIComponent(label)}`,
  };
}

const FRUIT_SECTIONS: FruitSection[] = [
  {
    id: "offers",
    title: "Offers",
    items: [
      fruitProduct("offers-strawberries", "Sweet Strawberries", 2.25, "400g", "FFF3F3", "Strawberries", 3),
      fruitProduct("offers-bananas", "Fairtrade Bananas", 1.15, "5 pack", "FFFBEA", "Bananas", 1.45),
      fruitProduct("offers-grapes", "Seedless Green Grapes", 2, "500g", "F3FAED", "Grapes", 2.75),
      fruitProduct("offers-oranges", "Sweet Easy Peelers", 1.75, "600g", "FFF6E8", "Oranges", 2.25),
    ],
  },
  {
    id: "berries",
    title: "Berries",
    items: [
      fruitProduct("berries-strawberries", "British Strawberries", 3, "400g", "FFF3F3", "Strawberries"),
      fruitProduct("berries-blueberries", "Sweet Blueberries", 2.5, "150g", "F2F1FF", "Blueberries"),
      fruitProduct("berries-raspberries", "Ripe Raspberries", 2.75, "150g", "FFF1F5", "Raspberries"),
      fruitProduct("berries-mixed", "Mixed Berry Selection", 4, "300g", "F7F1FF", "Mixed Berries"),
    ],
  },
  {
    id: "bananas",
    title: "Bananas",
    items: [
      fruitProduct("bananas-loose", "Loose Bananas", 0.85, "1kg", "FFFBEA", "Loose Bananas"),
      fruitProduct("bananas-pack", "Banana Pack", 1.15, "5 pack", "FFFBEA", "Banana Pack"),
      fruitProduct("bananas-organic", "Organic Fairtrade Bananas", 1.65, "5 pack", "F5FAE9", "Organic"),
      fruitProduct("bananas-mini", "Sweet Mini Bananas", 1.8, "250g", "FFF7D6", "Mini Bananas"),
    ],
  },
  {
    id: "citrus-fruit",
    title: "Citrus Fruit",
    items: [
      fruitProduct("citrus-oranges", "Large Sweet Oranges", 2.25, "5 pack", "FFF4E5", "Oranges"),
      fruitProduct("citrus-lemons", "Unwaxed Lemons", 1.2, "4 pack", "FFFDE7", "Lemons"),
      fruitProduct("citrus-limes", "Fresh Limes", 1, "4 pack", "F1F9E8", "Limes"),
      fruitProduct("citrus-grapefruit", "Pink Grapefruit", 0.9, "each", "FFF0ED", "Grapefruit"),
    ],
  },
  {
    id: "apples-and-pears",
    title: "Apples & Pears",
    items: [
      fruitProduct("apples-red", "Royal Gala Apples", 2, "6 pack", "FFF0F0", "Red Apples"),
      fruitProduct("apples-green", "Granny Smith Apples", 2.1, "6 pack", "F1F9E8", "Green Apples"),
      fruitProduct("pears-conference", "Conference Pears", 1.8, "5 pack", "F5F7E8", "Pears"),
      fruitProduct("pears-ripe", "Perfectly Ripe Pears", 2.25, "4 pack", "FAF5DF", "Ripe Pears"),
    ],
  },
  {
    id: "grapes",
    title: "Grapes",
    items: [
      fruitProduct("grapes-green", "Seedless Green Grapes", 2.75, "500g", "F3FAED", "Green Grapes"),
      fruitProduct("grapes-red", "Seedless Red Grapes", 2.75, "500g", "FFF0F3", "Red Grapes"),
      fruitProduct("grapes-black", "Sweet Black Grapes", 3, "500g", "F4F0F8", "Black Grapes"),
      fruitProduct("grapes-mixed", "Mixed Seedless Grapes", 3.25, "500g", "F6F2F4", "Mixed Grapes"),
    ],
  },
  {
    id: "other-fruit",
    title: "Other Fruit",
    items: [
      fruitProduct("other-mango", "Ripe Mango", 1.5, "each", "FFF3DF", "Mango"),
      fruitProduct("other-pineapple", "Extra Sweet Pineapple", 2, "each", "FFF8D9", "Pineapple"),
      fruitProduct("other-melon", "Galia Melon", 2.25, "each", "F2F9DF", "Melon"),
      fruitProduct("other-peaches", "Ripe & Ready Peaches", 2.5, "4 pack", "FFF0E8", "Peaches"),
    ],
  },
];

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

function NextCategoryButton({ category }: { category: CategoryLink }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.nextCategoryFooter,
        { paddingBottom: Math.max(insets.bottom, 20) },
      ]}
    >
      <TouchableOpacity
        style={styles.nextCategoryButton}
        onPress={() =>
          router.push({
            pathname: "/category/[slug]",
            params: { slug: category.slug },
          })
        }
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`View ${category.name}`}
      >
        <Text style={styles.nextCategoryButtonLabel}>
          View {category.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function FruitCategoryContent({
  nextCategory,
}: {
  nextCategory: CategoryLink;
}) {
  const contentRef = useRef<ScrollView>(null);
  const filterRef = useRef<ScrollView>(null);
  const categorySheetRef = useRef<BottomSheetModal>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const tabLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const isProgrammaticScroll = useRef(false);
  const scrollReleaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeSection, setActiveSection] = useState(FRUIT_SECTIONS[0].id);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);

  const renderCategorySheetBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.35}
        pressBehavior="close"
      />
    ),
    [],
  );

  const alignActiveTabToLeft = useCallback((sectionId: string) => {
    const tab = tabLayouts.current[sectionId];
    if (!tab) return;

    filterRef.current?.scrollTo({
      x: Math.max(0, tab.x - 12),
      animated: true,
    });
  }, []);

  useEffect(() => {
    alignActiveTabToLeft(activeSection);
  }, [activeSection, alignActiveTabToLeft]);

  useEffect(
    () => () => {
      if (scrollReleaseTimer.current) {
        clearTimeout(scrollReleaseTimer.current);
      }
    },
    [],
  );

  const selectSection = (sectionId: string) => {
    const y = sectionOffsets.current[sectionId];
    if (y == null) return;

    isProgrammaticScroll.current = true;
    setActiveSection(sectionId);
    contentRef.current?.scrollTo({ y, animated: true });

    if (scrollReleaseTimer.current) {
      clearTimeout(scrollReleaseTimer.current);
    }
    scrollReleaseTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);
  };

  const openCategoryList = () => {
    if (Platform.OS === "android") {
      categorySheetRef.current?.present();
      return;
    }

    setIsCategoryListOpen(true);
  };

  const closeCategoryList = () => {
    if (Platform.OS === "android") {
      categorySheetRef.current?.dismiss();
      return;
    }

    setIsCategoryListOpen(false);
  };

  const chooseCategory = (sectionId: string) => {
    closeCategoryList();
    selectSection(sectionId);
  };

  const categoryListContent = (
    <View style={styles.categoryListContent}>
      <View style={styles.categoryListHeader}>
        <Text style={styles.categoryListTitle}>Fruit categories</Text>
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={closeCategoryList}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close category list"
        >
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {FRUIT_SECTIONS.map((section) => {
        const isActive = section.id === activeSection;

        return (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.categoryListItem,
              isActive && styles.categoryListItemActive,
            ]}
            onPress={() => chooseCategory(section.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.categoryListItemLabel,
                isActive && styles.categoryListItemLabelActive,
              ]}
            >
              {section.title}
            </Text>
            {isActive && (
              <Ionicons name="checkmark" size={21} color="#247E80" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const handleContentScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (isProgrammaticScroll.current) return;

    const { contentOffset, contentSize, layoutMeasurement } =
      event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 24;
    const scrollPosition = contentOffset.y + 24;
    let nextActive = FRUIT_SECTIONS[0].id;

    if (isAtBottom) {
      nextActive = FRUIT_SECTIONS[FRUIT_SECTIONS.length - 1].id;
    } else {
      for (const section of FRUIT_SECTIONS) {
        const sectionY = sectionOffsets.current[section.id];
        if (sectionY != null && sectionY <= scrollPosition) {
          nextActive = section.id;
        } else {
          break;
        }
      }
    }

    if (nextActive !== activeSection) {
      setActiveSection(nextActive);
    }
  };

  return (
    <View style={styles.fruitContent}>
      <View style={styles.filterBar}>
        <View style={styles.filterScrollContainer}>
          <ScrollView
            ref={filterRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {FRUIT_SECTIONS.map((section) => {
              const isActive = section.id === activeSection;

              return (
                <TouchableOpacity
                  key={section.id}
                  style={[
                    styles.filterButton,
                    isActive && styles.filterButtonActive,
                  ]}
                  onPress={() => selectSection(section.id)}
                  onLayout={(event) => {
                    const { x, width } = event.nativeEvent.layout;
                    tabLayouts.current[section.id] = { x, width };
                  }}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`Show ${section.title}`}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      isActive && styles.filterLabelActive,
                    ]}
                  >
                    {section.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View
          pointerEvents="none"
          style={styles.filterFade}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {[
            0.05, 0.12, 0.22, 0.35, 0.5, 0.66, 0.8, 0.9, 0.96, 1,
          ].map((opacity, index) => (
            <View
              key={index}
              style={[
                styles.filterFadeStep,
                { backgroundColor: `rgba(255, 255, 255, ${opacity})` },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.showAllButton}
          onPress={openCategoryList}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Show all fruit categories"
          accessibilityHint="Opens a list of every fruit category"
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#247E80" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={contentRef}
        style={styles.sectionScroll}
        contentContainerStyle={styles.sectionContent}
        showsVerticalScrollIndicator
        onScroll={handleContentScroll}
        onScrollBeginDrag={() => {
          isProgrammaticScroll.current = false;
        }}
        scrollEventThrottle={16}
      >
        {FRUIT_SECTIONS.map((section) => (
          <View
            key={section.id}
            style={styles.fruitSection}
            onLayout={(event: LayoutChangeEvent) => {
              sectionOffsets.current[section.id] =
                event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.productGrid}>
              {section.items.map((item) => (
                <View key={item.id} style={styles.productGridItem}>
                  <ProductCard
                    item={item}
                    style={styles.gridProductCard}
                    compact
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
        <NextCategoryButton category={nextCategory} />
      </ScrollView>

      {Platform.OS === "android" ? (
        <BottomSheetModal
          ref={categorySheetRef}
          enableDynamicSizing
          backdropComponent={renderCategorySheetBackdrop}
          backgroundStyle={styles.androidSheetBackground}
          handleIndicatorStyle={styles.androidSheetIndicator}
        >
          <BottomSheetView style={styles.androidSheetContent}>
            {categoryListContent}
          </BottomSheetView>
        </BottomSheetModal>
      ) : (
        <Modal
          visible={isCategoryListOpen}
          transparent={Platform.OS === "web"}
          animationType={Platform.OS === "ios" ? "slide" : "fade"}
          presentationStyle={Platform.OS === "ios" ? "pageSheet" : "overFullScreen"}
          onRequestClose={closeCategoryList}
        >
          <View
            style={[
              styles.modalRoot,
              Platform.OS === "ios" && styles.iosModalRoot,
            ]}
          >
            {Platform.OS === "web" && (
              <Pressable
                style={styles.modalBackdrop}
                onPress={closeCategoryList}
                accessibilityRole="button"
                accessibilityLabel="Close category list"
              />
            )}

            <View
              style={[
                styles.categoryListModal,
                Platform.OS === "ios" && styles.iosCategoryListModal,
              ]}
            >
              {categoryListContent}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const category = CATEGORIES.find((item) => item.slug === slug);
  const categoryIndex = CATEGORIES.findIndex((item) => item.slug === slug);
  const defaultNextCategory =
    CATEGORIES[(categoryIndex + 1 + CATEGORIES.length) % CATEGORIES.length];
  const nextCategory =
    slug === "fruit"
      ? CATEGORIES.find((item) => item.slug === "vegetables")!
      : defaultNextCategory;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {category?.name ?? "Category"}
        </Text>

        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Search in ${category?.name ?? "category"}`}
        >
          <Ionicons name="search-outline" size={25} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {slug === "fruit" ? (
        <FruitCategoryContent nextCategory={nextCategory} />
      ) : (
        <ScrollView
          style={styles.sectionScroll}
          contentContainerStyle={styles.genericCategoryContent}
          showsVerticalScrollIndicator
        >
          <NextCategoryButton category={nextCategory} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  fruitContent: {
    flex: 1,
  },
  filterBar: {
    position: "relative",
    height: 57,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  filterScrollContainer: {
    width: "100%",
    height: 56,
  },
  filterContent: {
    paddingHorizontal: 12,
    paddingRight: 72,
    paddingVertical: 10,
    gap: 8,
  },
  filterButton: {
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 15,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterButtonActive: {
    backgroundColor: "#18C3B2",
    borderColor: "#18C3B2",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8A8F93",
  },
  filterLabelActive: {
    color: "#000000",
    fontWeight: "700",
  },
  showAllButton: {
    position: "absolute",
    right: 11,
    top: 10,
    zIndex: 3,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7EAEA",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterFade: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    width: 88,
    flexDirection: "row",
  },
  filterFadeStep: {
    flex: 1,
  },
  sectionScroll: {
    flex: 1,
    backgroundColor: "#F6F7F7",
  },
  sectionContent: {
    paddingBottom: 32,
  },
  nextCategoryFooter: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 28,
  },
  nextCategoryButton: {
    height: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#18C3B2",
    backgroundColor: "transparent",
  },
  nextCategoryButtonLabel: {
    fontSize: 16,
    fontWeight: "300",
    color: "#18C3B2",
  },
  genericCategoryContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  fruitSection: {
    paddingTop: 24,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 8,
    columnGap: 8,
    rowGap: 10,
  },
  productGridItem: {
    width: "31.8%",
  },
  gridProductCard: {
    width: "100%",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iosModalRoot: {
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  categoryListModal: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  iosCategoryListModal: {
    flex: 1,
    paddingTop: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  categoryListContent: {
    width: "100%",
  },
  androidSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  androidSheetIndicator: {
    width: 40,
    backgroundColor: "#C7C7C7",
  },
  androidSheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  categoryListHeader: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryListTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  modalCloseButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryListItem: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  categoryListItemActive: {
    backgroundColor: "#E8F5F5",
  },
  categoryListItemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#353535",
  },
  categoryListItemLabelActive: {
    color: "#247E80",
    fontWeight: "700",
  },
});
