import { MessagesSquare, Send, UserRoundSearch } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const steps = [
  {
    icon: UserRoundSearch,
    title: "Выбери персонажа",
    text: "Листай каталог и открывай профиль того, кто цепляет: tech, спорт, мода или wellness.",
    color: "#38bdf8",
  },
  {
    icon: MessagesSquare,
    title: "Залипни в ленту и чат",
    text: "Смотри посты, ставь лайки и попробуй демо-диалог — блогер отвечает в своём стиле.",
    color: "#e879f9",
  },
  {
    icon: Send,
    title: "Продолжи в Telegram",
    text: "Там персонаж на связи 24/7: помнит контекст, делится новым и иногда пишет первым.",
    color: "#fb923c",
  },
];

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          id="how-title"
          eyebrow="Как это работает"
          title="Три шага до разговора"
          text="Никаких регистраций и приложений — всё работает прямо в браузере и Telegram."
        />

        <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.1} className="h-full">
                <div className="glass relative h-full overflow-hidden rounded-[28px] p-6 md:p-7">
                  <div
                    className="absolute -top-20 -right-20 size-48 opacity-30"
                    style={{ background: `radial-gradient(closest-side, ${step.color}, transparent)` }}
                    aria-hidden
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className="relative grid size-14 place-items-center rounded-2xl border border-white/10 bg-bg"
                      style={{ boxShadow: `0 0 40px -12px ${step.color}` }}
                    >
                      <step.icon className="size-6" style={{ color: step.color }} aria-hidden />
                    </span>
                    <span className="font-display text-4xl font-semibold text-white/10" aria-hidden>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-[15px]/relaxed text-muted">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
