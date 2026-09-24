/**
 * Source images and how to derive web versions from them (ADR 0005).
 * `scripts/optimize-images.ts` reads this file; content refers to images by `key`.
 * Widths larger than the source are skipped (no upscaling).
 */
export type MediaSource = {
  /** File name inside `media-src/`. */
  file: string;
  /** Optional crop of the source, in source pixels. */
  crop?: { left: number; top: number; width: number; height: number };
  /** Make a light, low-saturation background transparent (used for the butterfly). */
  removeLightBackground?: boolean;
  /** Target widths in pixels. */
  widths: number[];
};

export const media = {
  portrait: { file: 'portrait.png', widths: [480, 720, 899] },
  watercolor: { file: 'watercolor.png', widths: [480, 941] },
  // Front cover = right half of the unfolded cover (without the fold marks).
  'cover-butterfly': {
    file: 'cover-butterfly-spread.jpeg',
    crop: { left: 812, top: 30, width: 745, height: 1112 },
    widths: [320, 480, 745],
  },
  // Temporary: butterfly cut from the cover until Ramona sends a transparent PNG.
  'butterfly-accent': {
    file: 'cover-butterfly-spread.jpeg',
    crop: { left: 1010, top: 175, width: 330, height: 320 },
    removeLightBackground: true,
    widths: [165, 240, 330],
  },
  'mug-handmade': {
    file: 'mug-handmade.jpeg',
    crop: { left: 0, top: 380, width: 900, height: 900 },
    widths: [400, 700, 900],
  },
} satisfies Record<string, MediaSource>;

export type MediaKey = keyof typeof media;

export const mediaKeys = Object.keys(media) as MediaKey[];

/** Open Graph images (1200×630) composed by the image script. */
export const ogImages = {
  default: { background: 'watercolor', photo: 'portrait' },
} as const;
