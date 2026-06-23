import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(__dirname, "../public/images/garba-town-logo-source.png");
const output = path.join(__dirname, "../public/images/garba-town-logo.png");

const candidates = [
  "C:/Users/rashm/.cursor/projects/c-Users-rashm-OneDrive-Documents-matinee-map-main-final-book-watch-book-watch/assets/c__Users_rashm_AppData_Roaming_Cursor_User_workspaceStorage_f8b7b6230ee4b2c2c17605987ac6dce8_images_image-46515b59-26db-4aa8-ab1d-9df701ce63e1.png",
  source,
  "C:/Users/rashm/.cursor/projects/c-Users-rashm-OneDrive-Documents-matinee-map-main-final-book-watch-book-watch/assets/garba-town-logo-v2.png",
];

let input = source;
for (const candidate of candidates) {
  try {
    await sharp(candidate).metadata();
    if (candidate !== source) fs.copyFileSync(candidate, source);
    input = source;
    break;
  } catch {
    // try next candidate
  }
}

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

const isOuterMatte = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max < 80 || (min > 220 && max - min < 28);
};

const visited = new Uint8Array(width * height);
const queue = [];

const tryPush = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const idx = y * width + x;
  if (visited[idx]) return;

  const offset = idx * 4;
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];

  if (!isOuterMatte(r, g, b)) return;

  visited[idx] = 1;
  queue.push(idx);
};

for (let x = 0; x < width; x++) {
  tryPush(x, 0);
  tryPush(x, height - 1);
}
for (let y = 0; y < height; y++) {
  tryPush(0, y);
  tryPush(width - 1, y);
}

while (queue.length > 0) {
  const idx = queue.pop();
  const x = idx % width;
  const y = Math.floor(idx / width);
  tryPush(x - 1, y);
  tryPush(x + 1, y);
  tryPush(x, y - 1);
  tryPush(x, y + 1);
}

for (let idx = 0; idx < visited.length; idx++) {
  if (visited[idx]) {
    data[idx * 4 + 3] = 0;
  }
}

await sharp(data, {
  raw: { width, height, channels: 4 },
})
  .trim()
  .png()
  .toFile(output);

const { width: outW, height: outH } = await sharp(output).metadata();
console.log(`Logo processed: ${outW}x${outH} -> ${output}`);
