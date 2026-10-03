import Image from "next/image";
import { bloggers } from "@/data/bloggers";
import { Reveal } from "./ui/Reveal";
import { TelegramButton } from "./ui/TelegramButton";

export function CtaBlock() {
  return (
    <section aria-labelledby="cta-title" className="px-4 py-16 md:px-6 md:py-24">
      <Reveal className="noise relative isolate mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.02] px-5 py-14 text-center sm:px-10 md:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -top-32 -left-24 size-[28rem] bg-[radial-gradient(closest-side,rgb(56_189_248/0.35),transparent)]" />
          <div className="absolute -right-24 -bottom-40 size-[30rem] bg-[radial-gradient(closest-side,rgb(232_121_249/0.3),transparent)]" />
          <div className="absolute top-1/3 left-1/2 size-[22rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(251_146_60/0.16),transparent)]" />
          <div className="bg-grid absolute inset-0 opacity-60" />
        </div>

        <div className="flex justify-center -space-x-3" aria-hidden>
          {bloggers.map((b) => (
            <span
              key={b.id}
              className="relative size-12 overflow-hidden rounded-full ring-[3px] ring-bg"
              style={{ boxShadow: `0 0 24px -4px ${b.accentColor}` }}
            >
              <Image src={b.avatar} alt="" fill sizes="48px" className="object-cover" />
            </span>
          ))}
        </div>

        <h2
          id="cta-title"
          className="mx-auto mt-6 max-w-3xl font-display text-[clamp(1.8rem,7vw,3.4rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance"
        >
          Твой <span className="whitespace-nowrap">AI-блогер</span>{" "}
          <span className="text-gradient">уже онлайн</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base/relaxed text-muted md:text-lg/relaxed">
          Переходи в Telegram: персонажи отвечают 24/7, помнят контекст и иногда пишут первыми.
        </p>

        <div className="mt-10 flex justify-center">
          <TelegramButton variant="glow" className="w-full max-w-sm sm:w-auto" />
        </div>
        <p className="mt-5 text-sm text-muted">Бесплатно · Без регистрации · 24/7</p>
      </Reveal>
    </section>
  );
}
