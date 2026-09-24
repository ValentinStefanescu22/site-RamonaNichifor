// Minimal types for `subset-font` (the package ships none).
declare module 'subset-font' {
  type Axis = number | { min: number; max: number; default?: number };
  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: {
      targetFormat?: 'woff2' | 'woff' | 'sfnt' | 'truetype';
      variationAxes?: Record<string, Axis>;
      noLayoutClosure?: boolean;
      preserveNameIds?: number[];
    },
  ): Promise<Buffer>;
}
