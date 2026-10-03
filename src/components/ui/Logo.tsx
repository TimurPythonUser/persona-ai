import { SITE_NAME } from "@/config";
import { cn } from "@/lib/format";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("bg-brand relative grid size-8 place-items-center rounded-[10px]", className)}
      aria-hidden
    >
      <span className="size-3 rounded-full bg-bg shadow-[0_0_0_3px_rgb(10_10_15/0.25)]" />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  const [name, tld] = SITE_NAME.split(".");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <LogoMark />
      <span>
        <span className="text-gradient">{name}</span>
        <span className="text-white/70">.{tld}</span>
      </span>
    </span>
  );
}
