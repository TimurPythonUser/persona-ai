"use client";

import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { BadgeCheck, Check, Send, UserPlus } from "lucide-react";
import type { Blogger } from "@/data/bloggers";
import { formatCompact } from "@/lib/format";
import { externalLinkProps, telegramLink } from "@/lib/telegram";
import { OnlineDot } from "./ui/OnlineDot";
import { useSheet } from "./SheetProvider";

type Props = {
  blogger: Blogger;
  titleId: string;
  /** На мобилке за обложку можно тянуть шторку вниз. */
  onCoverPointerDown?: (event: React.PointerEvent) => void;
};

export function ProfileHeader({ blogger, titleId, onCoverPointerDown }: Props) {
  const { isFollowing, toggleFollow } = useSheet();
  const following = isFollowing(blogger.id);
  const followers = blogger.followers + (following ? 1 : 0);

  const stats = [
    { label: "подписчиков", value: formatCompact(followers) },
    { label: "постов", value: formatCompact(blogger.posts) },
    { label: "вовлечённость", value: `${blogger.engagement.toString().replace(".", ",")}%` },
  ];

  return (
    <header className="relative">
      <div
        onPointerDown={onCoverPointerDown}
        className={`noise relative h-32 overflow-hidden md:h-40 ${onCoverPointerDown ? "touch-none" : ""}`}
        style={{
          background:
            "radial-gradient(90% 140% at 10% 0%, var(--accent) 0%, transparent 60%), radial-gradient(80% 140% at 95% 10%, var(--accent-2) 0%, transparent 65%), linear-gradient(180deg, #1b1b26, #101018)",
        }}
        aria-hidden
      >
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-panel to-transparent" />
      </div>

      <div className="relative -mt-14 px-5 md:px-7">
        <div className="flex items-end justify-between gap-3">
          <div className="relative size-24 md:size-28">
            <div
              className="absolute -inset-3 rounded-[36px] opacity-60 blur-2xl"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
              aria-hidden
            />
            <div className="relative size-full overflow-hidden rounded-[30px] ring-4 ring-panel">
              <Image
                src={blogger.avatar}
                alt={`${blogger.name} — аватар`}
                fill
                sizes="112px"
                placeholder="blur"
                className="object-cover"
              />
            </div>
            <span className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full bg-panel">
              <OnlineDot />
            </span>
          </div>
          <m.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => toggleFollow(blogger.id)}
            aria-pressed={following}
            className={`mb-1 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors ${
              following
                ? "border border-white/15 bg-white/[0.06] text-fg hover:bg-white/10"
                : "bg-(--accent) text-bg shadow-[0_8px_30px_-8px_var(--accent)] hover:brightness-110"
            }`}
          >
            {following ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <UserPlus className="size-4" aria-hidden />
            )}
            {following ? "Вы подписаны" : "Подписаться"}
          </m.button>
        </div>

        <h2
          id={titleId}
          className="mt-4 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"
        >
          {blogger.name}
          <BadgeCheck className="size-5 shrink-0 text-(--accent)" aria-label="Верифицированная AI-персона" />
        </h2>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <span>{blogger.handle}</span>
          <span aria-hidden>·</span>
          <span className="text-(--accent)">{blogger.niche}</span>
          <span aria-hidden>·</span>
          <span className="text-emerald-300">онлайн</span>
        </p>
        <p className="mt-3 text-[15px]/relaxed text-white/85">{blogger.bio}</p>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative flex flex-col-reverse items-center px-2 py-3">
              <dt className="text-xs text-muted">{stat.label}</dt>
              <dd className="font-display text-lg font-semibold tabular-nums">{stat.value}</dd>
              {i === 0 && (
                <AnimatePresence>
                  {following && (
                    <m.span
                      key="plus-one"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: [0, 1, 0], y: -18 }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                      className="pointer-events-none absolute top-1 right-3 text-xs font-semibold text-(--accent)"
                      aria-hidden
                    >
                      +1
                    </m.span>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </dl>

        <a
          href={telegramLink(blogger.id)}
          {...externalLinkProps}
          className="mt-3 flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold transition-colors hover:bg-white/10"
        >
          <Send className="size-4 shrink-0 text-(--accent)" aria-hidden />
          Написать в Telegram
        </a>
      </div>
    </header>
  );
}
