"use client";

import { useEffect } from "react";

/** Блокирует прокрутку страницы, пока компонент смонтирован. */
export function useScrollLock() {
  useEffect(() => {
    const { documentElement: html, body } = document;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: body.style.paddingRight };

    html.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      html.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
    };
  }, []);
}
