import { TELEGRAM_URL } from "@/config";

/** Ссылка на Telegram; с id блогера — deep-link `?start={id}` для персонализации. */
export function telegramLink(bloggerId?: string) {
  return bloggerId ? `${TELEGRAM_URL}?start=${encodeURIComponent(bloggerId)}` : TELEGRAM_URL;
}

export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
