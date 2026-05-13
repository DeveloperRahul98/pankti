// When a user adds the key dish, suggest these complementary dish ids.
export const PAIRINGS: Record<string, string[]> = {
  "chicken-dum-biryani": ["mirchi-bajji", "raita", "double-ka-meetha"],
  "hyderabadi-veg-biryani": ["mirchi-bajji", "raita", "kheer"],
  "paneer-butter-masala": ["butter-naan", "jeera-rice", "gulab-jamun"],
  "kadai-paneer": ["butter-naan", "raita"],
  "mutton-rogan-josh": ["butter-naan", "jeera-rice", "raita"],
  "chicken-curry": ["jeera-rice", "tandoori-roti", "raita"],
  "paneer-tikka": ["mango-lassi", "tandoori-roti"],
  "dal-makhani": ["butter-naan", "jeera-rice"],
  "gutti-vankaya": ["pulka", "jeera-rice"],
};

export const PAIRING_REASON: Record<string, string> = {
  "mirchi-bajji": "Crunch + heat balances the rice",
  "raita": "Cools the spice",
  "double-ka-meetha": "Saffron sweet to close the meal",
  "kheer": "A traditional ending",
  "butter-naan": "Mops up the gravy beautifully",
  "jeera-rice": "Soaks up the masala",
  "gulab-jamun": "A warm finish",
  "tandoori-roti": "Smoky pair with the curry",
  "mango-lassi": "Cools the smoky tandoor",
  "pulka": "Light, ghee-brushed pairing",
};
