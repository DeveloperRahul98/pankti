import { SignaturePlatesPage } from "@/components/signature-plates/signature-plates-page";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Signature plates",
  description:
    "Four curated catering plates — Wedding Feast, Pooja Bhojan, Birthday Special, Corporate Lunch. Load any plate and customise on the menu.",
  path: "/signature-plates",
});

export default function Page() {
  return <SignaturePlatesPage />;
}
