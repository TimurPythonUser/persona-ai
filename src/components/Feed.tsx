"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import type { Blogger } from "@/data/bloggers";
import { cn, formatCompact } from "@/lib/format";
import { postKey, useSheet } from "./SheetProvider";

type Props = {
  blogger: Blogger;
  onOpenPost: (index: number) => void;
};

export function Feed({ blogger, onOpenPost }: Props) {
  const { isLiked } = useSheet();

  return (
    <ul className="grid grid-cols-3 gap-2 px-4 pt-4 pb-8 md:gap-3 md:px-6">
      {blogger.feed.map((post, i) => {
        const liked = isLiked(postKey(blogger.id, i));
        return (
          <li key={i}>
            <button
              type="button"
              data-post-index={i}
              onClick={() => onOpenPost(i)}
              className="group block w-full text-left"
              aria-label={`Пост ${i + 1}: ${post.caption}`}
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 190px, 31vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/75 to-transparent px-2 pt-6 pb-2 text-xs font-medium">
                  <Heart
                    className={cn("size-3.5", liked ? "fill-(--accent) text-(--accent)" : "text-white")}
                    aria-hidden
                  />
                  {formatCompact(post.likes + (liked ? 1 : 0))}
                </span>
              </span>
              <span className="mt-2 line-clamp-2 text-xs/snug text-muted group-hover:text-white/85">
                {post.caption}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
