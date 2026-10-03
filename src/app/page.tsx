import { Catalog } from "@/components/Catalog";
import { CtaBlock } from "@/components/CtaBlock";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SheetProvider } from "@/components/SheetProvider";

export default function Home() {
  return (
    <SheetProvider>
      <a
        href="#catalog"
        className="sr-only z-50 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Перейти к каталогу
      </a>
      <Header />
      <main>
        <Hero />
        <Catalog />
        <HowItWorks />
        <CtaBlock />
      </main>
      <Footer />
    </SheetProvider>
  );
}
