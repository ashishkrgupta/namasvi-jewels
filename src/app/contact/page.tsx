import { createMetadata } from "@/lib/seo";
import { ContactPageClient } from "./ui";

export const metadata = createMetadata({
  title: "Contact Namasvi Jewels Pune",
  description:
    "Visit or message Namasvi Jewels in Keshavnagar, Mundhwa, Pune. Call 9935940113 or email namasvijewels@gmail.com.",
  path: "/contact",
  keywords: ["Artificial Jewellery Pune", "Premium Jewellery Store", "Namasvi Jewels"],
});

export default function ContactRoute() {
  return <ContactPageClient />;
}
