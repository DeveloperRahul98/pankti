import { ComparePage } from "@/components/plate/compare-page";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Compare plates",
  description:
    "Put two of your saved Pankti plates side-by-side to decide between menu ideas before you send the enquiry.",
  path: "/compare",
});

export default function Page() {
  return <ComparePage />;
}
