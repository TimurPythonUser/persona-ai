import type { Metadata, Viewport } from "next";
import { Unbounded } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/config";
import "./globals.css";

// Основной текст — системный шрифт (SF Pro / Roboto / Segoe UI): ноль лишних запросов
// и лучший LCP на мобилке. Акцентный шрифт для заголовков — Unbounded с кириллицей.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  display: "swap",
});

const title = `${SITE_NAME} — AI-блогеры нового поколения`;
const description =
  "Виртуальные блогеры со своим характером, лентой и чатом. Листай профили, лайкай посты и общайся с AI-персонами в Telegram 24/7.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: SITE_NAME,
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={unbounded.variable}>
      <body className="bg-bg font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
