export type SignaturePlate = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  itemIds: string[];
  occasion: string;
  image: string;
  highlight?: boolean;
};

export const SIGNATURE_PLATES: SignaturePlate[] = [
  {
    id: "wedding-feast",
    name: "Wedding Feast",
    tagline: "The grand traditional thaali",
    description:
      "A festive spread of starters, biryanis, regional curries and sweets — designed for marriage and reception gatherings.",
    itemIds: [
      "paneer-tikka",
      "chicken-65",
      "hyderabadi-veg-biryani",
      "chicken-dum-biryani",
      "paneer-butter-masala",
      "mutton-rogan-josh",
      "butter-naan",
      "dal-makhani",
      "raita",
      "double-ka-meetha",
      "rasmalai",
      "mango-lassi",
    ],
    occasion: "Wedding",
    image: "sig-wedding",
    highlight: true,
  },
  {
    id: "pooja-bhojan",
    name: "Pooja Bhojan",
    tagline: "Pure Jain-friendly, sattvik plate",
    description:
      "A reverent vegetarian plate without onion or garlic — ideal for housewarming, Satyanarayana vratam and naming ceremonies.",
    itemIds: [
      "hara-bhara-kebab",
      "jeera-rice",
      "pulka",
      "aloo-jeera",
      "dal-tadka",
      "raita",
      "papad",
      "kheer",
      "buttermilk",
    ],
    occasion: "House function · Pooja",
    image: "sig-pooja",
  },
  {
    id: "birthday-special",
    name: "Birthday Special",
    tagline: "A crowd-pleaser for any age",
    description:
      "Familiar favourites, balanced spice levels and a generous sweet finish — works for kids and elders alike.",
    itemIds: [
      "paneer-tikka",
      "gobi-65",
      "chicken-dum-biryani",
      "butter-naan",
      "paneer-butter-masala",
      "dal-makhani",
      "raita",
      "gulab-jamun",
      "mango-lassi",
    ],
    occasion: "Birthday · Anniversary",
    image: "sig-birthday",
  },
  {
    id: "corporate-lunch",
    name: "Corporate Lunch",
    tagline: "Light, balanced and timely",
    description:
      "A polished business-lunch plate that doesn't slow the afternoon — moderate spice, lighter portions, quick to serve.",
    itemIds: [
      "tomato-shorba",
      "hara-bhara-kebab",
      "jeera-rice",
      "butter-naan",
      "kadai-paneer",
      "dal-tadka",
      "salad",
      "kheer",
      "filter-coffee",
    ],
    occasion: "Corporate event",
    image: "sig-corporate",
  },
];
