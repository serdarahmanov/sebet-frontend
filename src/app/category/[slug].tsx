import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  FlashList,
  FlashListRef,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CATEGORIES } from "../../components/categories/category-grid";
import {
  Product,
  ProductCard,
} from "../../components/home/buy-it-again";
import { FRUIT_SECTIONS } from "../../data/categories/fruit/data";

type CategoryLink = {
  name: string;
  slug: string;
};

type FruitListItem =
  | {
      type: "header";
      id: string;
      sectionId: string;
      title: string;
    }
  | {
      type: "product";
      id: string;
      sectionId: string;
      product: Product;
    };

const SECTION_ACTIVATION_OFFSET = 8;
const MIN_LIST_BOTTOM_PADDING = 32;


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
  searchQuery,
  isSearching,
}: {
  nextCategory: CategoryLink;
  searchQuery: string;
  isSearching: boolean;
}) {
  const contentRef = useRef<FlashListRef<FruitListItem>>(null);
  const filterRef = useRef<ScrollView>(null);
  const categorySheetRef = useRef<BottomSheetModal>(null);
  const tabLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const isSearchingRef = useRef(isSearching);
  const isProgrammaticScroll = useRef(false);
  const programmaticReleaseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [activeSection, setActiveSection] = useState(FRUIT_SECTIONS[0].id);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
  const [listViewportHeight, setListViewportHeight] = useState(0);
  const [isListMeasured, setIsListMeasured] = useState(false);
  const [listBottomPadding, setListBottomPadding] = useState(
    MIN_LIST_BOTTOM_PADDING,
  );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleSections = useMemo(
    () =>
      isSearching
        ? FRUIT_SECTIONS.map((section) => ({
            ...section,
            items: section.title.toLowerCase().includes(normalizedQuery)
              ? section.items
              : section.items.filter(
                  (item) =>
                    item.name.toLowerCase().includes(normalizedQuery) ||
                    item.unit.toLowerCase().includes(normalizedQuery),
                ),
          })).filter((section) => section.items.length > 0)
        : FRUIT_SECTIONS,
    [isSearching, normalizedQuery],
  );
  const resultCount = visibleSections.reduce(
    (total, section) => total + section.items.length,
    0,
  );
  const listData = useMemo(
    () =>
      visibleSections.flatMap<FruitListItem>((section) => [
        {
          type: "header",
          id: `header-${section.id}`,
          sectionId: section.id,
          title: section.title,
        },
        ...section.items.map<FruitListItem>((product) => ({
          type: "product",
          id: product.id,
          sectionId: section.id,
          product,
        })),
      ]),
    [visibleSections],
  );
  const sectionStartIndices = useMemo(() => {
    const indices: Record<string, number> = {};
    listData.forEach((item, index) => {
      if (item.type === "header") {
        indices[item.sectionId] = index;
      }
    });
    return indices;
  }, [listData]);

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

  useEffect(() => {
    isSearchingRef.current = isSearching;
  }, [isSearching]);

  useEffect(() => {
    if (isSearching) {
      setListBottomPadding(MIN_LIST_BOTTOM_PADDING);
      return;
    }

    const lastSection = FRUIT_SECTIONS[FRUIT_SECTIONS.length - 1];
    const lastHeaderIndex = sectionStartIndices[lastSection.id];
    const lastHeaderLayout =
      lastHeaderIndex == null
        ? undefined
        : contentRef.current?.getLayout(lastHeaderIndex);
    const lastItemLayout =
      listData.length === 0
        ? undefined
        : contentRef.current?.getLayout(listData.length - 1);

    if (
      !lastHeaderLayout ||
      !lastItemLayout ||
      listViewportHeight === 0 ||
      !isListMeasured
    ) {
      return;
    }

    const contentEnd = lastItemLayout.y + lastItemLayout.height;
    const contentAfterLastHeader = contentEnd - lastHeaderLayout.y;
    const requiredPadding = Math.max(
      MIN_LIST_BOTTOM_PADDING,
      listViewportHeight -
        SECTION_ACTIVATION_OFFSET -
        contentAfterLastHeader,
    );

    if (Math.abs(requiredPadding - listBottomPadding) > 1) {
      setListBottomPadding(requiredPadding);
    }
  }, [
    isSearching,
    isListMeasured,
    listBottomPadding,
    listViewportHeight,
    listData,
    sectionStartIndices,
  ]);

  useEffect(
    () => () => {
      if (programmaticReleaseTimer.current) {
        clearTimeout(programmaticReleaseTimer.current);
      }
    },
    [],
  );

  const releaseProgrammaticScroll = useCallback(() => {
    isProgrammaticScroll.current = false;
    if (programmaticReleaseTimer.current) {
      clearTimeout(programmaticReleaseTimer.current);
      programmaticReleaseTimer.current = null;
    }
  }, []);

  const selectSection = async (sectionId: string) => {
    const index = sectionStartIndices[sectionId];
    if (index == null) return;

    isProgrammaticScroll.current = true;
    setActiveSection(sectionId);

    const headerLayout = contentRef.current?.getLayout(index);
    if (headerLayout) {
      contentRef.current?.scrollToOffset({
        offset: Math.max(0, headerLayout.y - SECTION_ACTIVATION_OFFSET),
        animated: true,
        skipFirstItemOffset: true,
      });
    } else {
      await contentRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
        viewOffset: SECTION_ACTIVATION_OFFSET,
      });
    }

    if (programmaticReleaseTimer.current) {
      clearTimeout(programmaticReleaseTimer.current);
    }
    programmaticReleaseTimer.current = setTimeout(
      releaseProgrammaticScroll,
      700,
    );
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

  const handleListScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isSearchingRef.current || isProgrammaticScroll.current) return;

      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const isAtBottom =
        contentOffset.y + layoutMeasurement.height >=
        contentSize.height - SECTION_ACTIVATION_OFFSET;
      let nextSectionId = FRUIT_SECTIONS[0].id;

      if (isAtBottom) {
        nextSectionId = FRUIT_SECTIONS[FRUIT_SECTIONS.length - 1].id;
      } else {
        const activationLine =
          contentOffset.y + SECTION_ACTIVATION_OFFSET;

        for (const section of FRUIT_SECTIONS) {
          const headerIndex = sectionStartIndices[section.id];
          const headerLayout =
            headerIndex == null
              ? undefined
              : contentRef.current?.getLayout(headerIndex);

          if (headerLayout && headerLayout.y <= activationLine) {
            nextSectionId = section.id;
          } else if (headerLayout) {
            break;
          }
        }
      }

      setActiveSection((current) =>
        current === nextSectionId ? current : nextSectionId,
      );
    },
    [sectionStartIndices],
  );

  const renderFruitItem = useCallback(
    ({ item }: ListRenderItemInfo<FruitListItem>) => {
      if (item.type === "header") {
        return <Text style={styles.sectionTitle}>{item.title}</Text>;
      }

      return (
        <View style={styles.productGridItem}>
          <ProductCard
            item={item.product}
            style={styles.gridProductCard}
            compact
          />
        </View>
      );
    },
    [],
  );

  return (
    <View style={styles.fruitContent}>
      {!isSearching && <View style={styles.filterBar}>
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
      </View>}

      {isSearching && (
        <View style={styles.searchSummary}>
          <Text style={styles.searchSummaryText}>
            {normalizedQuery
              ? `${resultCount} ${resultCount === 1 ? "result" : "results"}`
              : "All products"}
          </Text>
        </View>
      )}

      <FlashList
        ref={contentRef}
        data={listData}
        renderItem={renderFruitItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        getItemType={(item) => item.type}
        overrideItemLayout={(layout, item) => {
          if (item.type === "header") {
            layout.span = 3;
          }
        }}
        style={styles.sectionScroll}
        contentContainerStyle={[
          styles.sectionContent,
          {
            paddingBottom: listBottomPadding,
          },
        ]}
        onLayout={(event) => {
          setListViewportHeight(event.nativeEvent.layout.height);
        }}
        onLoad={() => setIsListMeasured(true)}
        showsVerticalScrollIndicator
        onScroll={handleListScroll}
        onScrollBeginDrag={() => {
          releaseProgrammaticScroll();
        }}
        onMomentumScrollEnd={releaseProgrammaticScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={
          isSearching ? (
          <View style={styles.emptySearch}>
            <Ionicons name="search-outline" size={34} color="#A7ACAF" />
            <Text style={styles.emptySearchTitle}>No products found</Text>
            <Text style={styles.emptySearchText}>
              Try a different product name.
            </Text>
          </View>
          ) : null
        }
        ListFooterComponent={
          !isSearching ? <NextCategoryButton category={nextCategory} /> : null
        }
      />

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
  const searchInputRef = useRef<TextInput>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const category = CATEGORIES.find((item) => item.slug === slug);
  const categoryIndex = CATEGORIES.findIndex((item) => item.slug === slug);
  const defaultNextCategory =
    CATEGORIES[(categoryIndex + 1 + CATEGORIES.length) % CATEGORIES.length];
  const nextCategory =
    slug === "fruit"
      ? CATEGORIES.find((item) => item.slug === "vegetables")!
      : defaultNextCategory;

  useEffect(() => {
    if (isSearching) {
      const focusTimer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(focusTimer);
    }
  }, [isSearching]);

  const closeSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleBack = () => {
    if (isSearching) {
      closeSearch();
      return;
    }

    router.back();
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>

        {isSearching ? (
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#74797D" />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${category?.name ?? "category"}`}
              placeholderTextColor="#989DA1"
              returnKeyType="search"
              autoCorrect={false}
              accessibilityLabel={`Search in ${category?.name ?? "category"}`}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery("")}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={20} color="#8A8F93" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {category?.name ?? "Category"}
            </Text>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsSearching(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Search in ${category?.name ?? "category"}`}
            >
              <Ionicons name="search-outline" size={25} color="#1A1A1A" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {slug === "fruit" ? (
        <FruitCategoryContent
          nextCategory={nextCategory}
          searchQuery={searchQuery}
          isSearching={isSearching}
        />
      ) : (
        <ScrollView
          style={styles.sectionScroll}
          contentContainerStyle={styles.genericCategoryContent}
          showsVerticalScrollIndicator
        >
          {isSearching ? (
            <View style={styles.emptySearch}>
              <Ionicons name="search-outline" size={34} color="#A7ACAF" />
              <Text style={styles.emptySearchTitle}>No products found</Text>
              <Text style={styles.emptySearchText}>
                Products have not been added to this category yet.
              </Text>
            </View>
          ) : (
            <NextCategoryButton category={nextCategory} />
          )}
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
  searchInputContainer: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F1F3F3",
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    paddingVertical: 0,
    fontSize: 16,
    color: "#111111",
  },
  clearSearchButton: {
    width: 30,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
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
  searchSummary: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  searchSummaryText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#74797D",
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
  emptySearch: {
    flex: 1,
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptySearchTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "600",
    color: "#313437",
  },
  emptySearchText: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: "#858A8E",
    textAlign: "center",
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  productGridItem: {
    width: "100%",
    paddingHorizontal: 4,
    paddingBottom: 10,
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
