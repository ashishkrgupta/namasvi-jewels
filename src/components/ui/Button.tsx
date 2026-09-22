import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "ink" | "ghost" | "line";
  size?: "sm" | "md" | "lg";
  href?: string;
};

export function Button({
  className,
  variant = "gold",
  size = "md",
  href,
  ...props
}: Props) {
  const variants = {
    gold: "gold-btn shadow-soft",
    ink: "bg-ink text-ivory hover:bg-charcoal",
    ghost: "bg-transparent text-charcoal hover:bg-mist",
    line: "border border-ink/15 bg-transparent text-charcoal hover:border-gold",
  };
  const sizes = {
    sm: "px-4 py-2 text-xs tracking-[0.18em]",
    md: "px-6 py-3 text-xs tracking-[0.2em]",
    lg: "px-8 py-4 text-sm tracking-[0.22em]",
  };
  const cls = cn(
    "inline-flex items-center justify-center rounded-full font-medium uppercase transition disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls} onClick={props.onClick as never}>
        {props.children}
      </Link>
    );
  }

  return <button className={cls} {...props} />;
}
