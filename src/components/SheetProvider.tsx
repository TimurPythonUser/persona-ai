"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { getBlogger } from "@/data/bloggers";

const loadSheet = () => import("./SheetHost");
const SheetHost = dynamic(loadSheet, { ssr: false });

/** Подгрузить код профиля заранее (наведение на карточку, первое взаимодействие). */
export const preloadSheet = () => void loadSheet();

// Открытый профиль живёт в hash (#mark): работает «Назад» на Android
// и можно поделиться ссылкой сразу на профиль.
const hashListeners = new Set<() => void>();

function subscribeHash(onChange: () => void) {
  hashListeners.add(onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    hashListeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

const notifyHash = () => hashListeners.forEach((listener) => listener());

type SheetContextValue = {
  open: (id: string) => void;
  close: () => void;
  isFollowing: (id: string) => boolean;
  toggleFollow: (id: string) => void;
  isLiked: (postKey: string) => boolean;
  toggleLike: (postKey: string) => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used inside <SheetProvider>");
  return ctx;
}

export const postKey = (bloggerId: string, index: number) => `${bloggerId}:${index}`;

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => "",
  );
  const blogger = getBlogger(decodeURIComponent(hash.slice(1)));

  // После первого открытия хост остаётся смонтированным — иначе не отыграет exit-анимация.
  const [hostMounted, setHostMounted] = useState(false);
  if (blogger && !hostMounted) setHostMounted(true);

  const [following, setFollowing] = useState<ReadonlySet<string>>(() => new Set());
  const [liked, setLiked] = useState<ReadonlySet<string>>(() => new Set());

  const open = useCallback((id: string) => {
    if (window.location.hash === `#${id}`) return;
    window.history.pushState({ sheet: id }, "", `#${id}`);
    notifyHash();
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.sheet) {
      window.history.back();
    } else {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
      notifyHash();
    }
  }, []);

  const value = useMemo<SheetContextValue>(
    () => ({
      open,
      close,
      isFollowing: (id) => following.has(id),
      toggleFollow: (id) => setFollowing((prev) => toggle(prev, id)),
      isLiked: (key) => liked.has(key),
      toggleLike: (key) => setLiked((prev) => toggle(prev, key)),
    }),
    [open, close, following, liked],
  );

  // Код профиля (вместе с Framer Motion) тянем при первом взаимодействии со страницей,
  // чтобы он не конкурировал с первой отрисовкой.
  useEffect(() => {
    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;
    const warmUp = () => {
      preloadSheet();
      events.forEach((e) => window.removeEventListener(e, warmUp));
    };
    events.forEach((e) => window.addEventListener(e, warmUp, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, warmUp));
  }, []);

  return (
    <SheetContext.Provider value={value}>
      {children}
      {hostMounted && <SheetHost blogger={blogger} onClose={close} />}
    </SheetContext.Provider>
  );
}

function toggle(set: ReadonlySet<string>, item: string) {
  const next = new Set(set);
  if (next.has(item)) next.delete(item);
  else next.add(item);
  return next;
}
