import type { BasketItem } from "../components/basket/basket-card";

type BasketBase = {
  id: string;
  createdAt: string;
  savings: number;
  deliveryFee: number;
  items: BasketItem[];
};

export type Basket =
  | (BasketBase & {
      fulfillmentType: "now";
    })
  | (BasketBase & {
      fulfillmentType: "scheduled";
      fulfillmentAt: string;
    })
  | (BasketBase & {
      fulfillmentType: "pickup";
      fulfillmentAt: string;
    });

export const BASKETS: Basket[] = [
  {
    id: "weekly-groceries",
    fulfillmentType: "now",
    createdAt: "2026-06-25T14:30:00+05:00",
    savings: 2.73,
    deliveryFee: 2,
    items: [
      {
        id: "milk",
        name: "Whole Milk",
        unit: "1L",
        price: 1.49,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Milk",
        initialQty: 2,
      },
      {
        id: "bread",
        name: "Seeded Whole Grain Sourdough Loaf",
        unit: "800g",
        price: 2.99,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Bread",
        initialQty: 1,
      },
      {
        id: "butter",
        name: "Lurpak Butter Spreadable",
        unit: "500g",
        price: 2.49,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Butter",
        initialQty: 1,
      },
      {
        id: "eggs",
        name: "Organic Free-Range Large Eggs",
        unit: "12 pack",
        price: 3.29,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Eggs",
        initialQty: 1,
      },
      {
        id: "juice",
        name: "Tropicana Orange Juice",
        unit: "1.4L",
        price: 1.99,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Juice",
        initialQty: 3,
      },
      {
        id: "yoghurt",
        name: "Greek Yoghurt",
        unit: "500g",
        price: 1.79,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Yoghurt",
        initialQty: 1,
      },
      {
        id: "cheese",
        name: "Mature Cheddar",
        unit: "400g",
        price: 3.49,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Cheese",
        initialQty: 1,
      },
      {
        id: "chicken",
        name: "Free-Range Chicken Breast",
        unit: "500g",
        price: 4.99,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Chicken",
        initialQty: 1,
      },
    ],
  },
  {
    id: "breakfast",
    fulfillmentType: "scheduled",
    fulfillmentAt: "2026-06-27T09:00:00+05:00",
    createdAt: "2026-06-25T13:15:00+05:00",
    savings: 1.25,
    deliveryFee: 2,
    items: [
      {
        id: "coffee",
        name: "Ground Arabica Coffee",
        unit: "250g",
        price: 4.75,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Coffee",
        initialQty: 1,
      },
      {
        id: "croissants",
        name: "Butter Croissants",
        unit: "4 pack",
        price: 3.5,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Croissant",
        initialQty: 2,
      },
    ],
  },
  {
    id: "fruit-and-veg",
    fulfillmentType: "pickup",
    fulfillmentAt: "2026-06-26T17:30:00+05:00",
    createdAt: "2026-06-25T15:45:00+05:00",
    savings: 0,
    deliveryFee: 0,
    items: [
      {
        id: "bananas",
        name: "Fairtrade Bananas",
        unit: "6 pack",
        price: 1.6,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Bananas",
        initialQty: 1,
      },
      {
        id: "avocados",
        name: "Ripe Avocados",
        unit: "2 pack",
        price: 2.4,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Avocado",
        initialQty: 2,
      },
      {
        id: "tomatoes",
        name: "Cherry Tomatoes",
        unit: "300g",
        price: 1.85,
        image: "https://placehold.co/120x120/F5F5F5/999?text=Tomatoes",
        initialQty: 1,
      },
    ],
  },
];

export function getOrderedBaskets(baskets: Basket[]) {
  return [...baskets].sort((a, b) => {
    const aIsNow = a.fulfillmentType === "now";
    const bIsNow = b.fulfillmentType === "now";

    if (aIsNow !== bIsNow) {
      return aIsNow ? -1 : 1;
    }

    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

export function getBasketFulfillmentLabel(basket: Basket) {
  if (basket.fulfillmentType === "now") {
    return "Now";
  }

  const date = new Date(basket.fulfillmentAt);
  const dateTime = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return basket.fulfillmentType === "scheduled"
    ? `Scheduled · ${dateTime}`
    : `Pickup · ${dateTime}`;
}

export function getBasketCreatedLabel(basket: Basket) {
  const created = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(basket.createdAt));

  return `Created ${created}`;
}

export function getBasketSubtotal(basket: Basket) {
  return basket.items.reduce(
    (total, item) => total + item.price * (item.initialQty ?? 1),
    0,
  );
}

export function getBasketById(id: string | string[] | undefined) {
  const basketId = Array.isArray(id) ? id[0] : id;
  return BASKETS.find((basket) => basket.id === basketId);
}
