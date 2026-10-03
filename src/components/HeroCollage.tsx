"use client";

import Image from "next/image";
import { bloggers } from "@/data/bloggers";
import { cn } from "@/lib/format";
import { OnlineDot } from "./ui/OnlineDot";
import { preloadSheet, useSheet } from "./SheetProvider";

// На мобилке — «веер» из карточек, на десктопе — сетка 2×2 со сдвигом колонок.
const layout = [
  "left-[0%] top-6 z-10 [--r:-10deg] [animation-delay:-1s]",
  "left-[21%] top-0 z-20 [--r:-3.5deg] [animation-delay:-3s] lg:mt-14",
  "left-[42%] top-1 z-30 [--r:3.5deg] [animation-delay:-5s]",
  "left-[62%] top-7 z-20 [--r:10deg] [animation-delay:-2s] lg:mt-14",
];

export function HeroCollage({ className }: { className?: string }) {
  const { open } = useSheet();

  return (
    <div className={cn("relative", className)}>
      <ul
        aria-label="AI-блогеры"
        className="relative mx-auto h-[clamp(200px,58vw,330px)] max-w-[560px] lg:grid lg:h-auto lg:max-w-none lg:grid-cols-2 lg:gap-5"
      >
        {bloggers.map((b, i) => (
          <li
            key={b.id}
            className={cn(
              "absolute w-[38%] [transform:rotate(var(--r))] animate-float lg:static lg:w-auto lg:[--r:0deg]",
              layout[i],
            )}
            style={{ "--accent": b.accentColor } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => open(b.id)}
              onPointerEnter={preloadSheet}
              onFocus={preloadSheet}
              aria-label={`Открыть профиль: ${b.name}`}
              className="group relative block w-full rounded-[22px] transition-transform duration-500 ease-out hover:-translate-y-2 hover:scale-[1.03] lg:rounded-[28px]"
            >
              <span
                className="absolute -inset-10 -z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
                aria-hidden
              />
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-white/5 ring-1 ring-white/20 lg:rounded-[28px]">
                <Image
                  src={b.avatar}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 270px, 30vw"
                  placeholder="blur"
                  loading="eager"
                  // Первая карточка — LCP-элемент на мобилке.
                  fetchPriority={i === 0 ? "high" : "auto"}
                  className="object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pt-8 pb-2.5 lg:px-4 lg:pb-4">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold sm:text-sm lg:text-base">
                    <OnlineDot className="size-2" />
                    {b.name.split(" ")[0]}
                  </span>
                  <span className="mt-0.5 hidden text-sm text-white/75 lg:block">{b.niche}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
