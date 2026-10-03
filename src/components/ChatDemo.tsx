"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUp, Send } from "lucide-react";
import type { Blogger, QuickReply } from "@/data/bloggers";
import { cn } from "@/lib/format";
import { externalLinkProps, telegramLink } from "@/lib/telegram";

type Message = { id: number; from: "bot" | "user"; text: string } | { id: number; from: "cta" };

type NewMessage = Message extends infer M ? (M extends Message ? Omit<M, "id"> : never) : never;

/** Чем длиннее сообщение — тем дольше «печатает…». */
const typingDelay = (text: string) => Math.min(1900, Math.max(700, 350 + text.length * 14));

const bubble = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring", stiffness: 420, damping: 32 },
} as const;

export function ChatDemo({ blogger }: { blogger: Blogger }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(true);
  const [used, setUsed] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const timers = useRef<number[]>([]);
  const nextId = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const wait = useCallback(
    (ms: number) => new Promise<void>((resolve) => timers.current.push(window.setTimeout(resolve, ms))),
    [],
  );

  const push = useCallback((message: NewMessage) => {
    setMessages((prev) => [...prev, { ...message, id: nextId.current++ }]);
  }, []);

  const botSay = useCallback(
    async (texts: string[], { cta = false, pause = 0 } = {}) => {
      setBusy(true);
      if (pause) await wait(pause);
      for (const text of texts) {
        setTyping(true);
        await wait(typingDelay(text));
        setTyping(false);
        push({ from: "bot", text });
        await wait(250);
      }
      if (cta) push({ from: "cta" });
      setBusy(false);
    },
    [push, wait],
  );

  // Приветствие проигрывается один раз при первом открытии таба.
  useEffect(() => {
    const pending = timers.current;
    const start = window.setTimeout(() => void botSay(blogger.chat.intro), 350);
    return () => {
      window.clearTimeout(start);
      pending.forEach(window.clearTimeout);
    };
  }, [blogger, botSay]);

  // Чат — последний блок в шторке, поэтому просто докручиваем её контейнер до низа.
  useEffect(() => {
    if (messages.length === 0 && !typing) return;
    const scroller = endRef.current?.closest<HTMLElement>("[data-sheet-scroller]");
    scroller?.scrollTo({ top: scroller.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages.length, typing, reduceMotion]);

  const ask = (reply: QuickReply) => {
    if (busy) return;
    const nextUsed = [...used, reply.label];
    setUsed(nextUsed);
    push({ from: "user", text: reply.label });
    void botSay([reply.answer], { pause: 450, cta: nextUsed.length === blogger.chat.quickReplies.length });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    push({ from: "user", text });
    void botSay([blogger.fallbackReply], { pause: 450, cta: true });
  };

  const replies = blogger.chat.quickReplies.filter((r) => !used.includes(r.label));
  const firstName = blogger.name.split(" ")[0];

  return (
    <div className="flex min-h-[62dvh] flex-col">
      <div
        role="log"
        aria-live="polite"
        aria-label={`Демо-чат: ${blogger.name}`}
        className="flex flex-1 flex-col gap-2.5 px-4 pt-5 pb-4 md:px-6"
      >
        <p className="mx-auto mb-2 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-muted">
          Демо-диалог · полная версия в Telegram
        </p>

        {messages.map((msg) =>
          msg.from === "cta" ? (
            <m.div key={msg.id} {...bubble} className="flex justify-start pl-10">
              <a
                href={telegramLink(blogger.id)}
                {...externalLinkProps}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-bg shadow-[0_10px_30px_-10px_var(--accent)] transition hover:brightness-110"
                style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
              >
                <Send className="size-4" aria-hidden />
                Продолжить разговор в Telegram
              </a>
            </m.div>
          ) : (
            <m.div
              key={msg.id}
              {...bubble}
              className={cn("flex items-end gap-2", msg.from === "user" ? "justify-end" : "justify-start")}
            >
              {msg.from === "bot" && <BotAvatar blogger={blogger} />}
              <p
                className={cn(
                  "max-w-[80%] rounded-3xl px-4 py-2.5 text-[15px]/snug whitespace-pre-line",
                  msg.from === "bot"
                    ? "rounded-bl-lg border border-white/10 bg-white/[0.06] text-fg"
                    : "rounded-br-lg bg-(--accent) font-medium text-bg",
                )}
              >
                <span className="sr-only">{msg.from === "bot" ? `${firstName}: ` : "Вы: "}</span>
                {msg.text}
              </p>
            </m.div>
          ),
        )}

        <AnimatePresence>
          {typing && (
            <m.div
              key="typing"
              {...bubble}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="flex items-end gap-2"
            >
              <BotAvatar blogger={blogger} />
              <span className="flex items-center gap-2 rounded-3xl rounded-bl-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-muted">
                <span className="flex gap-1" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <m.span
                      key={i}
                      className="size-1.5 rounded-full bg-white/70"
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </span>
                {firstName} печатает…
              </span>
            </m.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 z-10 border-t border-white/10 bg-panel/90 pb-safe backdrop-blur-xl">
        {replies.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3 md:flex-wrap md:px-6">
            {replies.map((reply) => (
              <button
                key={reply.label}
                type="button"
                onClick={() => ask(reply)}
                disabled={busy}
                className="min-h-11 shrink-0 rounded-full border border-(--accent)/40 bg-(--accent)/10 px-4 text-sm font-medium text-(--accent) transition hover:bg-(--accent)/20 disabled:opacity-50"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={submit} className="flex items-center gap-2 px-4 py-3 md:px-6">
          <label htmlFor={`chat-${blogger.id}`} className="sr-only">
            Ваше сообщение
          </label>
          <input
            id={`chat-${blogger.id}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Напиши что-нибудь…"
            autoComplete="off"
            enterKeyHint="send"
            maxLength={300}
            className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-base placeholder:text-white/45 focus:border-(--accent)/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            aria-label="Отправить"
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-(--accent) text-bg transition hover:brightness-110 disabled:opacity-40"
          >
            <ArrowUp className="size-5" aria-hidden />
          </button>
        </form>
      </div>
    </div>
  );
}

function BotAvatar({ blogger }: { blogger: Blogger }) {
  return (
    <span className="relative size-8 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
      <Image src={blogger.avatar} alt="" fill sizes="32px" className="object-cover" />
    </span>
  );
}
