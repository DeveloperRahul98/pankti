export type TeamMember = {
  id: string;
  name: string;
  role: string;
  yearsWithPankti: number;
  quote: string;
};

export const TEAM: TeamMember[] = [
  {
    id: "rahul",
    name: "Rahul",
    role: "Founder · Head of kitchen",
    yearsWithPankti: 5,
    quote:
      "Every plate carries my grandmother's hand. If it doesn't taste like family, we don't serve it.",
  },
  {
    id: "ramesh",
    name: "Chef Ramesh",
    role: "Biryani master",
    yearsWithPankti: 4,
    quote: "Dum biryani is patience. The pot tells you when it's ready.",
  },
  {
    id: "lakshmi",
    name: "Lakshmi Garu",
    role: "Sweets & desserts",
    yearsWithPankti: 5,
    quote:
      "The double ka meetha recipe? My mother's. I've not changed a single ingredient.",
  },
  {
    id: "venkat",
    name: "Venkat",
    role: "Service captain",
    yearsWithPankti: 3,
    quote:
      "I want every guest to feel like they're being served at their grandmother's house.",
  },
];
