import { externalLinkProps, telegramLink } from "@/lib/telegram";
import { Logo } from "./ui/Logo";

const links = [
  { href: "#catalog", label: "Блогеры" },
  { href: "#how", label: "Как это работает" },
  { href: telegramLink(), label: "Telegram", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 pb-safe">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm/relaxed text-muted">
            Витрина виртуальных блогеров. Все персонажи вымышлены и созданы нейросетями — совпадения с
            реальными людьми случайны.
          </p>
        </div>
        <nav aria-label="Ссылки в подвале">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? externalLinkProps : {})}
                  className="inline-flex h-11 items-center rounded-full px-3 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted md:px-6">
        © {new Date().getFullYear()} Persona.ai · Прототип, без реального бэкенда
      </div>
    </footer>
  );
}
