"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string };

export function ShoppingAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Namaste. I’m your Namasvi stylist. Ask me for earrings under ₹1000, bridal looks, or delivery.",
    },
  ]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    setLoading(false);
  }

  return (
    <>
      <button
        aria-label="Open shopping assistant"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-gold shadow-soft"
      >
        <Sparkles className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[min(92vw,360px)] overflow-hidden rounded-3xl border border-champagne bg-ivory shadow-soft">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-ivory">
            <p className="text-sm tracking-wide">Namasvi Stylist</p>
            <button aria-label="Close assistant" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.role === "assistant"
                    ? "rounded-2xl bg-mist px-3 py-2"
                    : "rounded-2xl bg-champagne/50 px-3 py-2 text-right"
                }
              >
                {m.text}
              </p>
            ))}
            {loading && <p className="text-xs text-gold">Thinking…</p>}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-champagne p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jewellery…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button aria-label="Send" className="text-gold">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export function WhatsAppButton() {
  const href = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "919935940113"}?text=${encodeURIComponent("Hi Namasvi Jewels, I’d like help choosing a piece.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
