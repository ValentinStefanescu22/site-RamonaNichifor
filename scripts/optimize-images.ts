/**
 * Image pipeline (ADR 0005). Run with `npm run images` (also runs before dev/build).
 *
 * For every entry in `media-src/media.config.ts`:
 *   source → optional crop / background removal → AVIF + WebP at each width
 * Output: `public/media/<key>-<width>.<ext>` and `src/generated/media-manifest.json`.
 * Also composes the default Open Graph image (1200×630).
 *
 * Files are regenerated only when the source or its config changed (hash in manifest).
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp, { type Sharp } from 'sharp';
import { media, type MediaSource } from '../media-src/media.config';

const root = process.cwd();
const srcDir = path.join(root, 'media-src');
const outDir = path.join(root, 'public', 'media');
const manifestPath = path.join(root, 'src', 'generated', 'media-manifest.json');

export type MediaManifestEntry = {
  width: number;
  height: number;
  /** Average colour, shown while the image loads. */
  color: string;
  /** Available widths, ascending. Files: `/media/<key>-<w>.avif|webp`. */
  widths: number[];
  hash: string;
};

type Manifest = { images: Record<string, MediaManifestEntry>; og: Record<string, string> };

/** Pixels that are light and unsaturated become transparent (sky/paper behind the butterfly). */
async function removeLightBackground(input: Sharp): Promise<Sharp> {
  const { data, info } = await input.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i]!,
      g = data[i + 1]!,
      b = data[i + 2]!;
    const min = Math.min(r, g, b) / 255;
    const saturation = Math.max(r, g, b) / 255 - min;
    let alpha = Math.max((0.86 - min) / 0.22, (saturation - 0.18) / 0.2);
    if (g >= r && g >= b) alpha *= 0.2; // fade the yellow-green paint splashes
    out[j] = r;
    out[j + 1] = g;
    out[j + 2] = b;
    out[j + 3] = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function prepare(source: MediaSource): Promise<Sharp> {
  let img = sharp(path.join(srcDir, source.file)).rotate(); // respect EXIF orientation
  if (source.crop) img = img.extract(source.crop);
  if (source.removeLightBackground) img = await removeLightBackground(sharp(await img.toBuffer()));
  return sharp(await img.png().toBuffer());
}

async function hashOf(source: MediaSource): Promise<string> {
  const file = await readFile(path.join(srcDir, source.file));
  return createHash('sha1').update(file).update(JSON.stringify(source)).digest('hex').slice(0, 12);
}

async function processImage(key: string, source: MediaSource, previous?: MediaManifestEntry) {
  const hash = await hashOf(source);
  const upToDate =
    previous?.hash === hash &&
    previous.widths.every((w) => existsSync(path.join(outDir, `${key}-${w}.avif`)));
  if (upToDate) return previous;

  const base = await prepare(source);
  const { width = 0, height = 0 } = await base.metadata();
  const widths = [...new Set(source.widths.map((w) => Math.min(w, width)))].sort((a, b) => a - b);

  for (const w of widths) {
    const resized = base.clone().resize({ width: w });
    await resized
      .clone()
      .avif({ quality: 55, effort: 5 })
      .toFile(path.join(outDir, `${key}-${w}.avif`));
    await resized
      .clone()
      .webp({ quality: 78, alphaQuality: 70 })
      .toFile(path.join(outDir, `${key}-${w}.webp`));
  }

  const { dominant } = await base.stats();
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  console.log(`  ✓ ${key} (${widths.join(', ')} px)`);
  return {
    width,
    height,
    color: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`,
    widths,
    hash,
  };
}

/** Default social-share image: watercolour background, butterfly, portrait on the right. */
async function buildDefaultOg(): Promise<string> {
  const file = 'og-default.jpg';
  const target = path.join(outDir, file);
  if (existsSync(target)) return `/media/${file}`;

  const W = 1200,
    H = 630;
  const background = await sharp(path.join(srcDir, media.watercolor.file))
    .resize({ width: W, height: H, fit: 'cover', position: 'right' })
    .flatten({ background: '#ffffff' })
    .toBuffer();
  // Portrait with a soft horizontal fade on the left edge.
  const photoW = 520;
  const photo = await sharp(path.join(srcDir, media.portrait.file))
    .resize({ width: photoW, height: H, fit: 'cover', position: 'top' })
    .toBuffer();
  const fade = Buffer.from(
    `<svg width="${photoW}" height="${H}"><defs><linearGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const fadedPhoto = await sharp(photo)
    .composite([{ input: fade, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // The butterfly (already cut out) balances the empty left side.
  const butterfly = await prepare(media['butterfly-accent']);
  const butterflyPng = await butterfly.resize({ width: 300 }).png().toBuffer();

  await sharp(background)
    .composite([
      { input: fadedPhoto, left: W - photoW, top: 0 },
      { input: butterflyPng, left: 190, top: 170 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target);
  console.log('  ✓ og-default');
  return `/media/${file}`;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const previous: Manifest = existsSync(manifestPath)
    ? JSON.parse(await readFile(manifestPath, 'utf8'))
    : { images: {}, og: {} };

  console.log('Optimizing images…');
  const images: Manifest['images'] = {};
  for (const [key, source] of Object.entries(media)) {
    images[key] = await processImage(key, source, previous.images[key]);
  }
  const og = { default: await buildDefaultOg() };

  await writeFile(manifestPath, JSON.stringify({ images, og }, null, 2) + '\n');
  console.log(`Done. Manifest: ${path.relative(root, manifestPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
