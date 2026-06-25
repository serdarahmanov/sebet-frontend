import { Product } from "../../../components/home/buy-it-again";

export type FruitSection = {
  id: string;
  title: string;
  items: Product[];
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

export const FRUIT_SECTIONS: FruitSection[] = [
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
