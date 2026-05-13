export type WeeklyRecipe = {
  dishId: string;
  storyTitle: string;
  story: string;
  servingNote: string;
};

export const RECIPE_OF_WEEK: WeeklyRecipe = {
  dishId: "chicken-dum-biryani",
  storyTitle: "Hyderabad's pride, sealed and slow-cooked",
  story:
    "There is no shortcut to dum biryani. We marinate the chicken overnight in yogurt, ginger-garlic and our own spice mix. The basmati is half-cooked in salted, whole-spice water. Then it's layered — chicken, rice, saffron milk, fried onions, mint — sealed with dough, and left to dum for forty-five minutes over the gentlest fire. The pot stays shut until it reaches the table.",
  servingNote: "Open at the table. Serve with mirchi salan, raita and a wedge of lemon.",
};
