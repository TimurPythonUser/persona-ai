"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/format";
import { Logo } from "./ui/Logo";
import { TelegramButton } from "./ui/TelegramButton";

const NAV = [
  { href: "#catalog", label: "Блогеры" },
  { href: "#how", label: "Как это работает" },
];

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function Header() {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b pt-safe transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-white/10 bg-bg/70 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-safe md:px-6">
        <a href="#top" className="-m-2 rounded-xl p-2" aria-label="Persona.ai — на главную">
          <Logo />
        </a>
        <nav aria-label="Основная навигация" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <TelegramButton variant="light">Telegram</TelegramButton>
      </div>
    </header>
  );
}
