export type GalleryImage = {
  id: string;
  caption: string;
  aspect: "tall" | "wide" | "square";
};

export const GALLERY: GalleryImage[] = [
  { id: "g1", caption: "Wedding reception · Banjara Hills", aspect: "wide" },
  { id: "g2", caption: "Live biryani station", aspect: "tall" },
  { id: "g3", caption: "Sweet counter", aspect: "square" },
  { id: "g4-food", caption: "Corporate Diwali buffet", aspect: "wide" },
  { id: "g5", caption: "Pooja bhojan setup", aspect: "tall" },
  { id: "g6", caption: "House warming spread", aspect: "square" },
  { id: "g7", caption: "Sangeet night", aspect: "wide" },
  { id: "g8", caption: "Anniversary dessert table", aspect: "tall" },
];
