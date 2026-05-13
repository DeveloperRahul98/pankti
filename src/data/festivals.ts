export type Festival = {
  id: string;
  name: string;
  date: string; // ISO YYYY-MM-DD
  menu: string;
  suggestedPlateId?: string;
};

// Static — easy to edit through the year.
export const FESTIVALS: Festival[] = [
  {
    id: "ugadi",
    name: "Ugadi",
    date: "2026-03-19",
    menu: "Pulihora · Bobbatlu · Pachadi",
    suggestedPlateId: "pooja-bhojan",
  },
  {
    id: "akshaya-tritiya",
    name: "Akshaya Tritiya",
    date: "2026-04-20",
    menu: "Sattvik thaali · Kheer · Payasam",
    suggestedPlateId: "pooja-bhojan",
  },
  {
    id: "wedding-season",
    name: "Wedding Season",
    date: "2026-05-01",
    menu: "Grand wedding feast · 12-course thaali",
    suggestedPlateId: "wedding-feast",
  },
  {
    id: "diwali",
    name: "Diwali",
    date: "2026-11-08",
    menu: "Saffron sweets · Festive thaali · Live counters",
    suggestedPlateId: "wedding-feast",
  },
];

export const ACTIVE_BANNER: Festival | null = FESTIVALS.find((f) => {
  const days =
    (new Date(f.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days > -2 && days < 45;
}) ?? null;
