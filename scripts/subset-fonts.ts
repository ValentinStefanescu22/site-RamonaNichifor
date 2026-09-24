/**
 * Font subsetting (docs/PLAN.md §10, performance).
 *
 * Google splits each font into `latin` + `latin-ext` files; Romanian (ă, ș, ț) needs
 * both, doubling the download. Here we keep exactly the characters the site uses and
 * produce ONE small WOFF2 per style (variable weight axis preserved).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import subsetFont from 'subset-font';

const root = process.cwd();
const srcDir = path.join(root, 'fonts-src');
const outDir = path.join(root, 'src', 'generated', 'fonts');

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join('');

/** Characters kept in every font. Extend when a new language needs more. */
const characters = [
  range(0x20, 0x7e), // Basic Latin (English, digits, punctuation)
  range(0xa0, 0xff), // Latin-1 (é, ü, ©, «», ·…)
  'ĂăȘșȚțŞşŢţ', // Romanian (â, î are in Latin-1); legacy cedilla forms included
  '–—‘’‚“”„…•€™←→↑↓', // typography
].join('');

// Only the weights the design uses (400 regular, 500 medium, 600 semibold) are kept;
// DM Sans' optical-size axis is fixed to its text setting.
const weights = { min: 400, max: 600, default: 400 };

type FontJob = { src: string; out: string; axes: Record<string, number | typeof weights> };

const fonts: FontJob[] = [
  { src: 'CormorantGaramond-VF.ttf', out: 'cormorant-garamond.woff2', axes: { wght: weights } },
  {
    src: 'CormorantGaramond-Italic-VF.ttf',
    out: 'cormorant-garamond-italic.woff2',
    axes: { wght: weights },
  },
  { src: 'DMSans-VF.ttf', out: 'dm-sans.woff2', axes: { wght: weights, opsz: 14 } },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  for (const font of fonts) {
    const target = path.join(outDir, font.out);
    if (existsSync(target) && !process.argv.includes('--force')) continue;
    const input = await readFile(path.join(srcDir, font.src));
    const output = await subsetFont(input, characters, {
      targetFormat: 'woff2',
      variationAxes: font.axes,
      // Drop alternate glyphs only reachable through OpenType features we don't use
      // (small caps, swashes…); Cormorant has hundreds of them.
      noLayoutClosure: true,
    });
    await writeFile(target, output);
    console.log(`  ✓ ${font.out} (${Math.round(output.length / 1024)} KB)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
