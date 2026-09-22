"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; message: string };

let push: ((message: string) => void) | null = null;

export function toast(message: string) {
  push?.(message);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    push = (message) => {
      const id = Date.now();
      setToasts((t) => [...t, { id, message }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
    };
    return () => {
      push = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-full border border-champagne bg-ink px-5 py-3 text-center text-sm text-ivory shadow-soft"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
