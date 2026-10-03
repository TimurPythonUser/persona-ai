// Собирает картинки для шаринга и иконки:
//   public/og.png          — Open Graph 1200×630 (коллаж из аватаров)
//   src/app/apple-icon.png — иконка для iOS 180×180
//   src/app/favicon.ico    — фавиконка 32×32 для старых браузеров
// Перезапусти `npm run og` после замены аватаров.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 630;

const bloggers = [
  { id: "mark", accent: "#38bdf8" },
  { id: "dan", accent: "#fb923c" },
  { id: "alice", accent: "#f472b6" },
  { id: "miya", accent: "#34d399" },
];

const brandStops = `
  <stop offset="0" stop-color="#38bdf8"/>
  <stop offset=".4" stop-color="#818cf8"/>
  <stop offset=".7" stop-color="#e879f9"/>
  <stop offset="1" stop-color="#fb923c"/>`;

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="a" cx="0.12" cy="0.1" r="0.6"><stop offset="0" stop-color="#38bdf8" stop-opacity=".35"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="0.85" cy="0.4" r="0.6"><stop offset="0" stop-color="#d946ef" stop-opacity=".3"/><stop offset="1" stop-color="#d946ef" stop-opacity="0"/></radialGradient>
    <radialGradient id="c" cx="0.45" cy="1.05" r="0.5"><stop offset="0" stop-color="#fb923c" stop-opacity=".22"/><stop offset="1" stop-color="#fb923c" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity=".05"/>
    </pattern>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">${brandStops}</linearGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">${brandStops}</linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0a0a0f"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect width="100%" height="100%" fill="url(#a)"/>
  <rect width="100%" height="100%" fill="url(#b)"/>
  <rect width="100%" height="100%" fill="url(#c)"/>

  <rect x="72" y="72" width="52" height="52" rx="15" fill="url(#mark)"/>
  <circle cx="98" cy="98" r="10" fill="#0a0a0f"/>
  <text x="142" y="110" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="700" fill="url(#brand)">Persona<tspan fill="#ffffff" fill-opacity=".7">.ai</tspan></text>

  <text font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="68" fill="#f5f5f7" letter-spacing="-2">
    <tspan x="72" y="300">AI-блогеры</tspan>
    <tspan x="72" y="378" fill="url(#brand)">нового</tspan>
    <tspan x="72" y="456" fill="url(#brand)">поколения</tspan>
  </text>
  <text x="72" y="540" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#a1a1aa">Лента, характер и чат 24/7 — в Telegram</text>
</svg>`;

const CARD_W = 210;
const CARD_H = 262;

async function card({ id, accent }) {
  const mask = Buffer.from(
    `<svg width="${CARD_W}" height="${CARD_H}"><rect width="${CARD_W}" height="${CARD_H}" rx="26" fill="#fff"/></svg>`,
  );
  const border = Buffer.from(
    `<svg width="${CARD_W}" height="${CARD_H}"><rect x="1.5" y="1.5" width="${CARD_W - 3}" height="${CARD_H - 3}" rx="25" fill="none" stroke="${accent}" stroke-opacity=".7" stroke-width="3"/></svg>`,
  );
  const avatar = await readFile(path.join("public", "bloggers", id, "avatar.webp"));
  return sharp(avatar)
    .resize(CARD_W, CARD_H, { fit: "cover" })
    .composite([
      { input: mask, blend: "dest-in" },
      { input: border, blend: "over" },
    ])
    .png()
    .toBuffer();
}

const placements = [
  { left: 640, top: 70, angle: -8 },
  { left: 900, top: 40, angle: 6 },
  { left: 680, top: 330, angle: 5 },
  { left: 930, top: 310, angle: -6 },
];

const layers = [];
for (const [i, b] of bloggers.entries()) {
  const img = await card(b);
  const rotated = await sharp(img)
    .rotate(placements[i].angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  layers.push({ input: rotated, left: placements[i].left, top: placements[i].top });
}

await sharp(Buffer.from(background)).composite(layers).png({ compressionLevel: 9 }).toFile("public/og.png");
console.log("✓ public/og.png");

const iconSvg = await readFile(path.join("src", "app", "icon.svg"));

await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="#0a0a0f"/></svg>`,
  ),
)
  .composite([{ input: await sharp(iconSvg).resize(132, 132).png().toBuffer(), left: 24, top: 24 }])
  .png()
  .toFile(path.join("src", "app", "apple-icon.png"));
console.log("✓ src/app/apple-icon.png");

// ICO-контейнер с PNG внутри (поддерживается всеми современными браузерами).
const png32 = await sharp(iconSvg).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // images count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await writeFile(path.join("src", "app", "favicon.ico"), Buffer.concat([header, png32]));
console.log("✓ src/app/favicon.ico");
