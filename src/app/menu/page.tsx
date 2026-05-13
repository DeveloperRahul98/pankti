import { MenuPage } from "@/components/menu/menu-page";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Menu",
  description:
    "Browse 34+ South & North Indian dishes. Build your custom catering plate with live per-plate pricing — Pankti catering, Hyderabad.",
  path: "/menu",
});

export default function Page() {
  return <MenuPage />;
}
