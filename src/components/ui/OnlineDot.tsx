import { cn } from "@/lib/format";

export function OnlineDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-2.5 shrink-0", className)} aria-hidden>
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400" />
      <span className="relative size-full rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153/0.8)]" />
    </span>
  );
}
