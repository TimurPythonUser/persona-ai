// Генерирует временные картинки (градиент в акцентном цвете + инициалы)
// по тем же путям, где потом будут лежать настоящие:
//   public/bloggers/{id}/avatar.webp, post-1.webp, post-2.webp, post-3.webp
//
// Существующие файлы НЕ перезаписываются — чтобы случайно не затереть
// настоящие картинки. Флаг --force перегенерирует всё.

import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1024;
const H = 1280;
const force = process.argv.includes("--force");

const bloggers = [
  { id: "mark", initials: "МР", from: "#38bdf8", to: "#1d4ed8" },
  { id: "dan", initials: "ДК", from: "#fdba74", to: "#ea580c" },
  { id: "alice", initials: "АМ", from: "#f9a8d4", to: "#c026d3" },
  { id: "miya", initials: "МС", from: "#6ee7b7", to: "#0d9488" },
];

const files = [
  { name: "avatar", label: "", angle: 160 },
  { name: "post-1", label: "POST 01", angle: 200 },
  { name: "post-2", label: "POST 02", angle: 120 },
  { name: "post-3", label: "POST 03", angle: 240 },
];

function svg({ initials, from, to }, { label, angle }) {
  const rad = (angle * Math.PI) / 180;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="${100 - x2}%" y1="${100 - y2}%" x2="${x2}%" y2="${y2}%">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="25%" r="70%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="#0a0a0f" stop-opacity="0"/>
      <stop offset="1" stop-color="#0a0a0f" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <circle cx="${W * 0.82}" cy="${H * 0.18}" r="220" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="${W * 0.12}" cy="${H * 0.86}" r="300" fill="#000000" fill-opacity="0.12"/>
  <rect width="100%" height="100%" fill="url(#shade)"/>
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
    font-family="Segoe UI, Arial, Helvetica, sans-serif" font-weight="700"
    font-size="300" fill="#ffffff" fill-opacity="0.92" letter-spacing="-8">${initials}</text>
  ${
    label
      ? `<text x="50%" y="${H - 110}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif"
    font-weight="600" font-size="44" fill="#ffffff" fill-opacity="0.7" letter-spacing="10">${label}</text>`
      : ""
  }
</svg>`;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

let created = 0;
for (const b of bloggers) {
  const dir = path.join("public", "bloggers", b.id);
  await mkdir(dir, { recursive: true });
  for (const f of files) {
    const out = path.join(dir, `${f.name}.webp`);
    if (!force && (await exists(out))) continue;
    await sharp(Buffer.from(svg(b, f))).webp({ quality: 82 }).toFile(out);
    created++;
    console.log("✓", out);
  }
}
console.log(created ? `Готово: ${created} файлов.` : "Все картинки уже на месте (используй --force, чтобы перегенерировать).");
