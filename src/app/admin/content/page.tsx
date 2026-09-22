import { prisma } from "@/lib/prisma";
import { ContentForm } from "./ui";

export default async function ContentPage() {
  const [announcement, about, promo, banner] = await Promise.all([
    prisma.announcement.findFirst({ where: { active: true } }),
    prisma.siteContent.findUnique({ where: { key: "about" } }),
    prisma.siteContent.findUnique({ where: { key: "promo" } }),
    prisma.banner.findFirst({ where: { active: true } }),
  ]);
  return (
    <ContentForm
      announcement={announcement?.message}
      about={about?.value as { headline?: string; body?: string }}
      promo={promo?.value as { text?: string }}
      banner={
        banner
          ? {
              title: banner.title,
              subtitle: banner.subtitle ?? undefined,
              image: banner.image,
            }
          : undefined
      }
    />
  );
}
