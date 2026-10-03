"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domMax } from "framer-motion";
import type { Blogger } from "@/data/bloggers";
import BloggerSheet from "./BloggerSheet";

// Весь Framer Motion живёт в этом ленивом чанке: на главной он не нужен,
// а профиль — единственное место с drag, layout-анимациями и exit-переходами.
export default function SheetHost({ blogger, onClose }: { blogger: Blogger | null; onClose: () => void }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {blogger && <BloggerSheet key={blogger.id} blogger={blogger} onClose={onClose} />}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}
