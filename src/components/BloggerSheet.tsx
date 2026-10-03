"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { AnimatePresence, m, useDragControls, type PanInfo } from "framer-motion";
import { Grid3x3, MessageCircle, X } from "lucide-react";
import type { Blogger } from "@/data/bloggers";
import { cn } from "@/lib/format";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ChatDemo } from "./ChatDemo";
import { Feed } from "./Feed";
import { PostViewer } from "./PostViewer";
import { ProfileHeader } from "./ProfileHeader";

type Tab = "feed" | "chat";

const TABS: { id: Tab; label: string; icon: typeof Grid3x3 }[] = [
  { id: "feed", label: "Лента", icon: Grid3x3 },
  { id: "chat", label: "Чат", icon: MessageCircle },
];

const CLOSE_OFFSET = 120;
const CLOSE_VELOCITY = 600;

const sheetMotion = {
  initial: { y: "100%" },
  animate: { y: 0, transition: { type: "spring", stiffness: 340, damping: 36 } },
  exit: { y: "100%", transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } },
} as const;

const modalMotion = {
  initial: { opacity: 0, scale: 0.96, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 32 } },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18 } },
} as const;

export default function BloggerSheet({ blogger, onClose }: { blogger: Blogger; onClose: () => void }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const id = useId();

  const [tab, setTab] = useState<Tab>("feed");
  const [chatStarted, setChatStarted] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const lastViewed = useRef(0);

  useScrollLock();
  useFocusTrap(rootRef);

  const closeViewer = () => {
    if (viewerIndex !== null) lastViewed.current = viewerIndex;
    setViewerIndex(null);
  };

  // Пока открыт пост, шторка inert и теряет фокус — возвращаем его на плитку последнего поста.
  const restorePostFocus = () => {
    scrollRef.current
      ?.querySelector<HTMLElement>(`[data-post-index="${lastViewed.current}"]`)
      ?.focus({ preventScroll: true });
  };

  const selectTab = (next: Tab) => {
    setTab(next);
    if (next === "chat") setChatStarted(true);
    // Если уже проскроллили ниже табов — показываем новый таб с начала.
    const scroller = scrollRef.current;
    const tabs = tabsRef.current;
    if (scroller && tabs && scroller.scrollTop > tabs.offsetTop) scroller.scrollTop = tabs.offsetTop;
  };

  const onTabKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const next = tab === "feed" ? "chat" : "feed";
    selectTab(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  // Esc слушаем на document: фокус может оказаться где угодно (например, после свайпа мышкой).
  const onEscape = useEffectEvent(() => {
    if (viewerIndex !== null) closeViewer();
    else onClose();
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (offset.y > CLOSE_OFFSET || velocity.y > CLOSE_VELOCITY) onClose();
  };

  const startDrag = isDesktop ? undefined : (event: React.PointerEvent) => dragControls.start(event);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
      style={
        {
          "--accent": blogger.accentColor,
          "--accent-2": blogger.accentColorAlt,
        } as React.CSSProperties
      }
    >
      <m.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />

      <m.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
        inert={viewerIndex !== null}
        {...(isDesktop ? modalMotion : sheetMotion)}
        drag={isDesktop ? false : "y"}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.9 }}
        onDragEnd={onDragEnd}
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden border border-white/10 bg-panel shadow-2xl shadow-black/60 outline-none",
          isDesktop
            ? "h-[min(860px,calc(100dvh_-_48px))] max-w-[640px] rounded-[32px]"
            : "h-[90dvh] rounded-t-[28px] border-b-0",
        )}
      >
        {/* Свечение в цвете блогера */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 opacity-40 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
          aria-hidden
        />

        {!isDesktop && (
          <div
            onPointerDown={startDrag}
            className="relative z-10 flex h-7 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            aria-hidden
          >
            <span className="h-1.5 w-11 rounded-full bg-white/30" />
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть профиль"
          className={cn(
            "absolute right-3 z-30 grid size-11 place-items-center rounded-full border border-white/15 bg-black/35 backdrop-blur-md transition hover:bg-black/55",
            isDesktop ? "top-3" : "top-10",
          )}
        >
          <X className="size-5" aria-hidden />
        </button>

        <div
          ref={scrollRef}
          data-sheet-scroller
          className="relative min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:rgb(255_255_255/0.15)_transparent] overflow-y-auto overscroll-contain"
        >
          <ProfileHeader blogger={blogger} titleId={`${id}-title`} onCoverPointerDown={startDrag} />

          <div
            ref={tabsRef}
            className="sticky top-0 z-20 mt-6 border-b border-white/10 bg-panel/85 px-16 py-2 backdrop-blur-xl"
          >
            <div
              role="tablist"
              aria-label="Разделы профиля"
              className="mx-auto flex max-w-sm rounded-2xl bg-white/[0.05] p-1"
            >
              {TABS.map(({ id: tabId, label, icon: Icon }) => {
                const selected = tab === tabId;
                return (
                  <button
                    key={tabId}
                    id={`${id}-tab-${tabId}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={tabId === "chat" && !chatStarted ? undefined : `${id}-panel-${tabId}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(tabId)}
                    onKeyDown={onTabKeyDown}
                    className={cn(
                      "relative flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors",
                      selected ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {selected && (
                      <m.span
                        layoutId={`${id}-tab-pill`}
                        className="absolute inset-0 rounded-xl border border-white/10 bg-white/10"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon className="relative size-4" aria-hidden />
                    <span className="relative">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`${id}-panel-feed`}
            aria-labelledby={`${id}-tab-feed`}
            hidden={tab !== "feed"}
          >
            <Feed blogger={blogger} onOpenPost={setViewerIndex} />
          </div>
          {chatStarted && (
            <div
              role="tabpanel"
              id={`${id}-panel-chat`}
              aria-labelledby={`${id}-tab-chat`}
              hidden={tab !== "chat"}
            >
              <ChatDemo blogger={blogger} />
            </div>
          )}
        </div>
      </m.div>

      <AnimatePresence onExitComplete={restorePostFocus}>
        {viewerIndex !== null && (
          <PostViewer
            blogger={blogger}
            index={viewerIndex}
            onIndexChange={setViewerIndex}
            onClose={closeViewer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
