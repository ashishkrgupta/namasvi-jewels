export type SearchIntent = {
  query: string;
  category?: string;
  occasion?: string;
  maxPrice?: number;
  minPrice?: number;
  color?: string;
  trending?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
};

const CATEGORY_MAP: Record<string, string[]> = {
  earrings: ["earring", "earrings", "jhumka", "jhumkas", "studs", "hoops", "chandbali"],
  necklaces: ["necklace", "necklaces", "choker", "pendant", "haar", "chain"],
  bangles: ["bangle", "bangles", "kada", "bracelet", "kadas"],
};

const OCCASION_MAP: Record<string, string[]> = {
  Wedding: ["wedding", "bridal", "bride", "shaadi", "haldi", "mehendi"],
  Festive: ["festive", "festival", "diwali", "navratri", "eid", "karva"],
  "Daily Wear": ["daily", "everyday", "office", "work", "casual"],
  Party: ["party", "cocktail", "night"],
  Gifting: ["gift", "gifting", "present"],
};

function pick(map: Record<string, string[]>, text: string) {
  for (const [key, words] of Object.entries(map)) {
    if (words.some((w) => text.includes(w))) return key;
  }
  return undefined;
}

export function parseNaturalSearch(raw: string): SearchIntent {
  const query = raw.trim();
  const text = query.toLowerCase();
  const intent: SearchIntent = { query };

  intent.category = pick(CATEGORY_MAP, text)?.toLowerCase();
  intent.occasion = pick(OCCASION_MAP, text);

  const under = text.match(/(?:under|below|less than|upto|up to)\s*₹?\s*(\d{2,6})/);
  if (under) intent.maxPrice = Number(under[1]);

  const between = text.match(/between\s*₹?\s*(\d{2,6})\s*(?:and|to|-)\s*₹?\s*(\d{2,6})/);
  if (between) {
    intent.minPrice = Number(between[1]);
    intent.maxPrice = Number(between[2]);
  }

  if (text.includes("rose gold")) intent.color = "Rose Gold";
  else if (text.includes("antique")) intent.color = "Antique Gold";
  else if (text.includes("silver")) intent.color = "Silver";
  else if (text.includes("gold")) intent.color = "Gold";

  if (text.includes("trending") || text.includes("trendy")) intent.trending = true;
  if (text.includes("new arrival") || text.includes("latest")) intent.newArrival = true;
  if (text.includes("best seller") || text.includes("bestseller") || text.includes("popular")) {
    intent.bestSeller = true;
  }

  return intent;
}

export function assistantReply(message: string) {
  const text = message.toLowerCase();

  if (/(deliver|shipping|when will|how long)/.test(text)) {
    return "We ship from Keshavnagar, Mundhwa, Pune within 1–2 business days. Complimentary shipping on orders above ₹999, and most orders arrive in 3–6 days across India. You can track any paid order from your account.";
  }
  if (/(wedding|bridal)/.test(text)) {
    return "For weddings, start with our Bridal Collection — kundan chandbalis, temple necklace sets, and polki chokers under affordable luxury. Tell me your budget and I’ll shortlist looks.";
  }
  if (/(otp|login|account)/.test(text)) {
    return "You can log in with email and password or request a 6-digit OTP on your phone. Guest checkout is also available if you prefer not to create an account.";
  }
  if (/(payment|upi|razorpay|card)/.test(text)) {
    return "We accept UPI, Razorpay, credit/debit cards, net banking, and wallets. Checkout is encrypted and every order is quality-checked before dispatch.";
  }
  if (/(pune|store|location|visit)/.test(text)) {
    return "Namasvi Jewels is based in Keshavnagar, Mundhwa, Pune. You can reach us on 9935940113 or WhatsApp the same number — we’d love to help you choose a piece.";
  }
  if (/(gift|gifting)/.test(text)) {
    return "For gifting, daily-wear studs and layered chains between ₹499–₹1,299 feel personal without being intimidating. Add a note at checkout and we’ll pack it beautifully.";
  }
  if (/(hello|hi|hey|namaste)/.test(text)) {
    return "Namaste. I’m your Namasvi stylist. Ask me for earrings under ₹1000, bridal sets, delivery timelines, or a look for a special day — I’ll guide you with warmth.";
  }

  return "I can help you find jewellery by occasion, budget, or style — for example, “show me earrings for a wedding under ₹1000”. You can also ask about shipping, payments, or our Pune studio.";
}
