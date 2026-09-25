import { BRAND } from "@/lib/constants";

export const WHATSAPP_SAMPLE =
  "Hi Namasvi Jewels, I would like help choosing a piece. Please share today's recommendations.";

export function whatsappPhone() {
  return (process.env.NEXT_PUBLIC_WHATSAPP || BRAND.whatsapp).replace(/\D/g, "");
}

export function whatsappHref(message = WHATSAPP_SAMPLE) {
  const text = encodeURIComponent(message);
  const phone = whatsappPhone();
  return {
    app: `whatsapp://send?phone=${phone}&text=${text}`,
    web: `https://api.whatsapp.com/send?phone=${phone}&text=${text}`,
  };
}

export function openWhatsApp(message = WHATSAPP_SAMPLE) {
  const { app, web } = whatsappHref(message);
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (mobile) {
    window.location.href = app;
    return;
  }
  window.open(web, "_blank", "noopener,noreferrer");
}
