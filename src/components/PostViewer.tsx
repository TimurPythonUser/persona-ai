"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { AnimatePresence, m, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import type { Blogger } from "@/data/bloggers";
import { cn, formatExact } from "@/lib/format";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { postKey, useSheet } from "./SheetProvider";

type Props = {
  blogger: Blogger;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 500;

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? "45%" : "-45%", opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-45%" : "45%", opacity: 0, scale: 0.96 }),
};

export function PostViewer({ blogger, index, onIndexChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);

  const { isLiked, toggleLike } = useSheet();
  const [direction, setDirection] = useState(0);
  const [burst, setBurst] = useState(0);
  const lastTap = useRef(0);

  const total = blogger.feed.length;
  const post = blogger.feed[index];
  const key = postKey(blogger.id, index);
  const liked = isLiked(key);
  const likes = post.likes + (liked ? 1 : 0);

  const go = (delta: number) => {
    const next = index + delta;
    if (next < 0 || next >= total) return;
    setDirection(delta);
    onIndexChange(next);
  };

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) go(1);
    else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) go(-1);
  };

  // Двойной тап по фото — лайк, как в Instagram.
  const onTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) toggleLike(key);
      setBurst((b) => b + 1);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const onArrow = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => onArrow(event);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <m.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Пост ${index + 1} из ${total} — ${blogger.name}`}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-20 flex flex-col bg-black/92 pt-safe pb-safe backdrop-blur-xl outline-none"
    >
      <div className="flex shrink-0 items-center gap-3 px-4 py-3 md:px-6">
        <span className="relative size-9 overflow-hidden rounded-xl ring-1 ring-white/15">
          <Image src={blogger.avatar} alt="" fill sizes="36px" className="object-cover" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-semibold">{blogger.name}</span>
          <span className="block truncate text-xs text-muted">{blogger.handle}</span>
        </span>
        <span className="text-sm text-muted tabular-nums" aria-hidden>
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/15"
          aria-label="Закрыть пост"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.div
            key={index}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            onTap={onTap}
            className="relative aspect-[4/5] w-[min(100%,560px,calc((100dvh_-_270px)_*_0.8))] cursor-grab touch-pan-y overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 select-none active:cursor-grabbing"
          >
            <Image
              src={post.image}
              alt={post.alt}
              fill
              sizes="(min-width: 768px) 560px, 92vw"
              placeholder="blur"
              draggable={false}
              className="pointer-events-none object-cover"
            />
          </m.div>
        </AnimatePresence>

        <AnimatePresence>
          {burst > 0 && (
            <m.span
              key={burst}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 1.1] }}
              transition={{ duration: 0.9, times: [0, 0.25, 0.6, 1] }}
              onAnimationComplete={() => setBurst(0)}
              className="pointer-events-none absolute inset-0 grid place-items-center"
              aria-hidden
            >
              <Heart className="size-28 fill-white text-white drop-shadow-[0_0_30px_var(--accent)]" />
            </m.span>
          )}
        </AnimatePresence>

        <NavButton side="left" disabled={index === 0} onClick={() => go(-1)} />
        <NavButton side="right" disabled={index === total - 1} onClick={() => go(1)} />
      </div>

      <div className="mx-auto w-full max-w-[592px] shrink-0 px-4 pt-4 pb-5">
        <div className="flex items-center gap-3">
          <m.button
            type="button"
            onClick={() => toggleLike(key)}
            whileTap={{ scale: 0.85 }}
            aria-pressed={liked}
            aria-label="Нравится"
            className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/15"
          >
            <m.span
              key={liked ? "on" : "off"}
              initial={{ scale: liked ? 0.5 : 1 }}
              animate={{ scale: liked ? [0.5, 1.35, 1] : 1 }}
              transition={{ duration: 0.4 }}
              className="grid place-items-center"
            >
              <Heart
                className={cn("size-6", liked ? "fill-(--accent) text-(--accent)" : "text-white")}
                aria-hidden
              />
            </m.span>
          </m.button>
          <p className="text-sm" aria-live="polite">
            <span className="font-semibold tabular-nums">{formatExact(likes)}</span>{" "}
            <span className="text-muted">отметок «Нравится»</span>
          </p>
        </div>
        <p className="mt-3 text-[15px]/relaxed text-white/90">
          <span className="font-semibold">{blogger.handle}</span> {post.caption}
        </p>
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {blogger.feed.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-5 bg-(--accent)" : "w-1.5 bg-white/30",
              )}
            />
          ))}
        </div>
      </div>
    </m.div>
  );
}

function NavButton({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Предыдущий пост" : "Следующий пост"}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 backdrop-blur transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-0 md:grid",
        side === "left" ? "left-4 lg:left-8" : "right-4 lg:right-8",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
