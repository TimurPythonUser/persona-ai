import { cn } from "@/lib/format";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  id?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, text, id, align = "left" }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 font-display text-[clamp(1.75rem,6.5vw,3rem)] leading-[1.08] font-semibold tracking-[-0.025em]"
      >
        {title}
      </h2>
      {text && <p className="mt-4 text-base/relaxed text-muted md:text-lg/relaxed">{text}</p>}
    </Reveal>
  );
}
