import { ContactPage } from "@/components/contact/contact-page";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Reach Pankti Catering — WhatsApp, call, email, kitchen address in Hyderabad. We usually reply within the hour.",
  path: "/contact",
});

export default function Page() {
  return <ContactPage />;
}
