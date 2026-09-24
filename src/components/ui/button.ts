/** Shared button styles for `<a>` and `<button>` (keeps markup semantic). */
const base =
  'caps inline-flex min-h-11 items-center justify-center gap-3 rounded-full px-6 py-2.5 text-[0.95rem] leading-tight transition-colors duration-200';

const variants = {
  primary: 'bg-lavender-strong text-white hover:bg-lavender-deep',
  secondary:
    'border border-lavender-strong/40 bg-paper text-lavender-strong hover:border-lavender-strong hover:bg-mist',
  ghost: 'text-lavender-strong underline-offset-4 hover:underline px-0',
} as const;

export function buttonClasses(variant: keyof typeof variants = 'primary', extra = ''): string {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
