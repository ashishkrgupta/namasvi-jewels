"use client";

export function PrintButton() {
  return (
    <button
      className="no-print mt-6 rounded-full bg-ink px-4 py-2 text-sm text-ivory"
      onClick={() => window.print()}
    >
      Print label
    </button>
  );
}
