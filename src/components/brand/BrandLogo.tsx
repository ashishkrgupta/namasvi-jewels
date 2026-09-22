import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LOGO = { src: "/logo.png", width: 1024, height: 904 };
const WORDMARK = { src: "/wordmark.png", width: 1456, height: 256 };

const SIZES = {
  sm: { logo: 32, word: 16 },
  md: { logo: 46, word: 24 },
  lg: { logo: 72, word: 34 },
  xl: { logo: 148, word: 56 },
} as const;

export function BrandLogo({
  size = "md",
  href = "/",
  showWordmark = true,
  className,
}: {
  size?: keyof typeof SIZES;
  href?: string;
  showWordmark?: boolean;
  className?: string;
}) {
  const { logo, word } = SIZES[size];
  const inner = (
    <>
      <Image
        src={LOGO.src}
        alt=""
        width={LOGO.width}
        height={LOGO.height}
        className="w-auto object-contain object-left"
        style={{ height: logo }}
        priority={size !== "sm"}
        unoptimized
      />
      {showWordmark && (
        <span className="leading-none">
          <Image
            src={WORDMARK.src}
            alt="Namasvi"
            width={WORDMARK.width}
            height={WORDMARK.height}
            className="w-auto object-contain object-left"
            style={{ height: word }}
            priority={size !== "sm"}
          />
          <span
            className={cn(
              "mt-0.5 block text-[9px] tracking-[0.42em] text-gold uppercase",
              size === "sm" && "hidden",
            )}
          >
            Jewels
          </span>
          {size !== "sm" && (
            <span className="mt-1 hidden font-serif text-[10px] italic text-[#5c1a28]/75 sm:block">
              by {BRAND.founder}
            </span>
          )}
        </span>
      )}
    </>
  );

  const classes = cn("flex items-center gap-2.5 sm:gap-3", className);

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={BRAND.name}>
        {inner}
      </Link>
    );
  }

  return <div className={classes}>{inner}</div>;
}
