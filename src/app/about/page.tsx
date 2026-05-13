import { AboutPage } from "@/components/about/about-page";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "About",
  description:
    "The story behind Pankti — five years of weddings, poojas and corporate feasts cooked from one Hyderabad kitchen. Meet the team and the founder.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}
