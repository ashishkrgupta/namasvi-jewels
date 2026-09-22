import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseNaturalSearch, assistantReply } from "@/lib/ai";
import { searchByIntent } from "@/lib/catalog";
import { handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { message } = z.object({ message: z.string().min(1) }).parse(await req.json());
    const intent = parseNaturalSearch(message);
    const products = await searchByIntent(intent);
    let reply = assistantReply(message);
    if (products.length && /(show|find|earring|necklace|bangle|under|wedding)/i.test(message)) {
      const names = products.slice(0, 3).map((p) => p.name).join(", ");
      reply = `I found ${products.length} pieces. You might love ${names}. Open Shop to see the full edit, or ask me to tighten the budget.`;
    }
    if (process.env.OPENAI_API_KEY) {
      try {
        const ai = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are the Namasvi Jewels stylist in Pune. Be warm, concise, and premium. Never be pushy.",
              },
              { role: "user", content: message },
            ],
          }),
        });
        const json = await ai.json();
        reply = json.choices?.[0]?.message?.content || reply;
      } catch {
        /* keep local reply */
      }
    }
    return NextResponse.json({ reply, products: products.slice(0, 6), intent });
  } catch (e) {
    return handleError(e);
  }
}
