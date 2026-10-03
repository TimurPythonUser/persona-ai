// Приводит настоящие картинки к нужному формату.
// Кидаешь в public/bloggers/{id}/ файлы avatar.png / post-1.jpg и т.п.
// (png, jpg, jpeg, webp, avif) — скрипт обрежет их до 4:5 (умный кроп по «интересной» области),
// ужмёт максимум до 1024×1280 (без апскейла), сохранит как .webp и удалит исходник.

import { readdir, rm, rename } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join("public", "bloggers");
const NAMES = new Set(["avatar", "post-1", "post-2", "post-3"]);
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const MAX_WIDTH = 1024;

const isReady = (ext, { width, height }) =>
  ext === ".webp" && width <= MAX_WIDTH && Math.abs(width / height - 0.8) < 0.005;

let count = 0;
for (const id of await readdir(ROOT)) {
  const dir = path.join(ROOT, id);
  for (const file of await readdir(dir)) {
    const ext = path.extname(file).toLowerCase();
    const name = path.basename(file, path.extname(file));
    if (!NAMES.has(name) || !EXT.has(ext)) continue;

    const src = path.join(dir, file);
    const out = path.join(dir, `${name}.webp`);
    const meta = await sharp(src).metadata();
    // Уже в нужном формате — не трогаем, чтобы не пережимать по кругу.
    if (isReady(ext, meta)) continue;

    const width = Math.min(MAX_WIDTH, meta.width, Math.floor(meta.height * 0.8));
    const height = Math.round(width * 1.25);
    const tmp = `${out}.tmp`;
    await sharp(src)
      .rotate()
      .resize(width, height, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 82 })
      .toFile(tmp);
    if (ext !== ".webp") await rm(src);
    await rename(tmp, out);
    count++;
    console.log("✓", out, `(${meta.width}×${meta.height} → ${width}×${height})`);
  }
}
console.log(count ? `Обработано: ${count}.` : "Нечего обрабатывать — всё уже в формате 4:5 webp.");
