import { ArrowDown } from "lucide-react";
import { bloggers, totalReach } from "@/data/bloggers";
import { formatCompact } from "@/lib/format";
import { HeroCollage } from "./HeroCollage";
import { OnlineDot } from "./ui/OnlineDot";
import { TelegramButton } from "./ui/TelegramButton";

const stats = [
  { value: String(bloggers.length), label: "AI-блогера" },
  { value: "24/7", label: "онлайн" },
  { value: formatCompact(totalReach), label: "охват" },
];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-6 pb-16 md:pt-14 lg:pb-28">
      <HeroBackdrop />

      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-10 px-4 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="glass inline-flex animate-fade-up items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/85 sm:text-sm">
            <OnlineDot />
            {bloggers.length} AI-персоны онлайн прямо сейчас
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.15rem,9vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
            AI-блогеры <span className="text-gradient">нового поколения</span>
          </h1>

          <p className="mt-5 max-w-xl animate-fade-up text-base/relaxed text-muted [animation-delay:120ms] md:text-lg/relaxed">
            Свой характер, своя лента и живой чат. Они не устают, не выгорают и всегда на связи. Знакомься с
            виртуальными персонами и общайся с ними в Telegram.
          </p>

          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:200ms] sm:flex-row">
            <a
              href="#catalog"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-black transition-[transform,background-color] duration-300 hover:bg-white/90 active:scale-[0.97]"
            >
              Смотреть блогеров
              <ArrowDown
                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>
            <TelegramButton variant="glass" />
          </div>
        </div>

        <HeroCollage className="lg:col-start-2 lg:row-span-2 lg:row-start-1" />

        <dl className="glass grid animate-fade-up grid-cols-3 divide-x divide-white/10 rounded-2xl [animation-delay:280ms] lg:col-start-1 lg:row-start-2 lg:max-w-xl">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse items-center px-2 py-4 sm:items-start sm:px-6"
            >
              <dt className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</dt>
              <dd className="font-display text-xl font-semibold tracking-tight sm:text-3xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <div className="bg-grid absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,transparent,var(--color-bg))]" />
      <div className="absolute -top-40 -left-40 size-[36rem] bg-[radial-gradient(closest-side,rgb(56_189_248/0.28),transparent)]" />
      <div className="absolute top-10 -right-48 size-[40rem] bg-[radial-gradient(closest-side,rgb(217_70_239/0.22),transparent)]" />
      <div className="absolute -bottom-56 left-1/4 size-[36rem] bg-[radial-gradient(closest-side,rgb(251_146_60/0.14),transparent)]" />
    </div>
  );
}
