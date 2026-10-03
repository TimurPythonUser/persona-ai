"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Плавное появление при скролле: fade + slide снизу.
 * Сделано на CSS-переходах и IntersectionObserver, а не на Framer Motion,
 * чтобы не тащить анимационную библиотеку в стартовый бандл лендинга.
 */
export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown={shown}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
