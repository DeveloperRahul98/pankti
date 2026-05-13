export type Testimonial = {
  id: string;
  name: string;
  occasion: string;
  quote: string;
  rating: 4 | 5;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Sneha & Karthik",
    occasion: "Wedding · 320 guests",
    quote:
      "Every elder at the reception came up to ask who catered. The biryani was the talk of the night.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Lakshmi Garu",
    occasion: "Satyanarayana Vratam",
    quote:
      "Sattvik, clean, and served with such warmth. The pulkas were soft three hours into the function — that says everything.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Rohit Mehra",
    occasion: "Office Diwali · 80 guests",
    quote:
      "We needed something premium without being heavy. The corporate plate was perfectly balanced. Team is still talking about the double ka meetha.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Anita Reddy",
    occasion: "Daughter's 1st Birthday",
    quote:
      "Customised everything for our mixed crowd — kids, grandparents, Jain guests. Not one complaint. That's rare.",
    rating: 5,
  },
];
