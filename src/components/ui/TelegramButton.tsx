import { Send } from "lucide-react";
import { cn } from "@/lib/format";
import { externalLinkProps, telegramLink } from "@/lib/telegram";

type Props = {
  children?: React.ReactNode;
  variant?: "light" | "glass" | "glow";
  className?: string;
};

const variants = {
  light: "h-11 px-4 text-sm bg-white text-black hover:bg-white/90",
  glass: "h-13 px-6 text-[15px] glass text-fg hover:bg-white/10",
  glow: "h-15 px-8 text-base text-bg bg-brand hover:brightness-110 sm:h-16 sm:px-10 sm:text-lg",
};

export function TelegramButton({ children = "Перейти в Telegram", variant = "glass", className }: Props) {
  return (
    <a
      href={telegramLink()}
      {...externalLinkProps}
      className={cn(
        "group relative isolate inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-[transform,filter,background-color] duration-300 active:scale-[0.97]",
        variants[variant],
        className,
      )}
    >
      {variant === "glow" && (
        <span
          className="absolute -inset-1 -z-10 animate-glow rounded-full opacity-80 shadow-[-18px_0_36px_-6px_#38bdf8,0_0_40px_-4px_#a78bfa,18px_0_36px_-6px_#fb923c] transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      )}
      <Send
        className={cn(
          "shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          variant === "glow" ? "size-5" : "size-4",
        )}
        aria-hidden
      />
      {children}
    </a>
  );
}
