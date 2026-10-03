"use client";

import { useEffect, useRef, useState } from "react";
import { bloggers } from "@/data/bloggers";
import { cn } from "@/lib/format";
import { BloggerCard } from "./BloggerCard";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

export function Catalog() {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // На мобилке карточки листаются горизонтально — подсвечиваем точку текущей.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: list, threshold: 0.6 },
    );
    list.querySelectorAll("li").forEach((li) => observer.observe(li));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (index: number) => {
    const list = listRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;
    list.scrollTo({ left: item.offsetLeft - list.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <section id="catalog" aria-labelledby="catalog-title" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          id="catalog-title"
          eyebrow="Каталог"
          title={
            <>
              Выбери своего <span className="whitespace-nowrap">AI-блогера</span>
            </>
          }
          text="Четыре персоны — четыре характера. Открой профиль, полистай ленту и попробуй пообщаться прямо здесь."
        />

        <ul
          ref={listRef}
          className="-mx-4 mt-10 no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-2 pb-6 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4"
        >
          {bloggers.map((blogger, i) => (
            <li
              key={blogger.id}
              data-index={i}
              className="w-[82%] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <Reveal className="h-full" delay={i * 0.08}>
                <BloggerCard blogger={blogger} />
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="flex justify-center md:hidden">
          {bloggers.map((blogger, i) => (
            <button
              key={blogger.id}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Показать: ${blogger.name}`}
              aria-current={active === i}
              className="grid size-11 place-items-center"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  active === i ? "w-6 bg-white" : "w-1.5 bg-white/30",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
