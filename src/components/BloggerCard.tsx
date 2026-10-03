"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Blogger } from "@/data/bloggers";
import { formatCompact } from "@/lib/format";
import { OnlineDot } from "./ui/OnlineDot";
import { preloadSheet, useSheet } from "./SheetProvider";

export function BloggerCard({ blogger }: { blogger: Blogger }) {
  const { open } = useSheet();

  return (
    <article
      onPointerEnter={preloadSheet}
      onTouchStart={preloadSheet}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition-[translate,scale,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)] hover:shadow-[0_30px_80px_-30px_var(--accent)] has-[button:active]:scale-[0.98] has-[button:active]:duration-150"
      style={{ "--accent": blogger.accentColor } as React.CSSProperties}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <Image
          src={blogger.avatar}
          alt={`${blogger.name} — AI-блогер`}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 45vw, 82vw"
          placeholder="blur"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" aria-hidden />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium">
            <OnlineDot className="size-2" />
            онлайн
          </span>
          <span className="rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-black/55 px-2.5 py-1 text-xs font-semibold text-(--accent)">
            {blogger.niche}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 pb-3">
          <h3 className="font-display text-xl font-semibold tracking-tight">{blogger.name}</h3>
          <p className="mt-0.5 text-sm text-white/75">{blogger.handle}</p>
          <p className="mt-2 truncate text-sm text-white/85">{blogger.tagline}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 p-4 pt-3">
        <p className="flex flex-col leading-tight">
          <span className="font-display text-base font-semibold tabular-nums">
            {formatCompact(blogger.followers)}
          </span>
          <span className="text-xs text-muted">подписчиков</span>
        </p>
        <button
          type="button"
          onClick={() => open(blogger.id)}
          onFocus={preloadSheet}
          aria-label={`Смотреть блог: ${blogger.name}`}
          className="inline-flex h-11 grow items-center justify-center gap-1.5 rounded-full bg-(--accent) pr-3 pl-4 text-sm font-semibold text-bg transition-[filter] after:absolute after:inset-0 after:content-[''] hover:brightness-110"
        >
          Смотреть блог
          <ArrowUpRight className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}
