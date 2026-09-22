"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";

const FLOATS = [
  {
    src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80",
    className: "left-[6%] top-[18%] w-24 float-slow md:w-32",
  },
  {
    src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
    className: "right-[8%] top-[22%] w-20 float-slower md:w-28",
  },
  {
    src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80",
    className: "bottom-[14%] left-[12%] w-24 float-slower md:w-36",
  },
];

export function Hero({
  image,
  title,
  subtitle,
}: {
  image: string;
  title: string;
  subtitle: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={image}
          alt="Namasvi Jewels luxury jewellery"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/20" />
      </motion.div>

      {FLOATS.map((f) => (
        <div
          key={f.src}
          className={`pointer-events-none absolute hidden overflow-hidden rounded-full border border-gold/40 shadow-soft sm:block ${f.className}`}
        >
          <Image src={f.src} alt="" width={160} height={160} className="h-full w-full object-cover" />
        </div>
      ))}

      <motion.div
        style={{ opacity }}
        className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 lg:justify-center lg:px-8 lg:pb-24"
      >
        <p className="text-[11px] tracking-[0.42em] text-gold uppercase">
          Timeless Beauty. Everyday You.
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.12] text-ivory sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-champagne sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/shop" size="lg">
            Shop Collection
          </Button>
          <Button href="/shop?newArrival=1" size="lg" variant="line" className="border-champagne text-ivory hover:border-gold">
            View New Arrivals
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
