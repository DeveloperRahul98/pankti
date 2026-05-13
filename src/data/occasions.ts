export type Occasion = {
  id: string;
  label: string;
  description: string;
  signaturePlateId: string;
  emoji: string;
};

export const OCCASIONS: Occasion[] = [
  {
    id: "wedding",
    label: "Wedding",
    description: "Pellikuthuru, reception, sangeet — the grand feast.",
    signaturePlateId: "wedding-feast",
    emoji: "💍",
  },
  {
    id: "pooja",
    label: "Pooja & Housewarming",
    description: "Griha pravesh, vratam, naming ceremony — sattvik plates.",
    signaturePlateId: "pooja-bhojan",
    emoji: "🪔",
  },
  {
    id: "birthday",
    label: "Birthday & Anniversary",
    description: "Family celebrations with familiar favourites.",
    signaturePlateId: "birthday-special",
    emoji: "🎂",
  },
  {
    id: "corporate",
    label: "Corporate Event",
    description: "Office lunches, product launches, off-sites.",
    signaturePlateId: "corporate-lunch",
    emoji: "💼",
  },
];
