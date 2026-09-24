import type { SVGProps } from 'react';

// Inline SVG icons (no icon font, no extra requests). Decorative by default.
const paths = {
  book: 'M4 5.5C6.5 4 9.5 4 12 5.5v14c-2.5-1.5-5.5-1.5-8 0v-14Zm8 0c2.5-1.5 5.5-1.5 8 0v14c-2.5-1.5-5.5-1.5-8 0',
  brush:
    'M14.5 4.5 19.5 9.5 11 18c-1 1-2.5 1.2-3.7.6L5 21l1-3.3c-.6-1.2-.4-2.7.6-3.7l7.9-9.5Zm-1.5 2 4.5 4.5',
  sprout: 'M12 21v-9m0 0c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6Zm0 0c0-4 2.8-7 7-7 0 4-2.8 7-7 7Z',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z',
  arrow: 'M4 12h15m-5-5 5 5-5 5',
  chevron: 'm6 9 6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  mail: 'M4 6h16v12H4V6Zm0 0 8 7 8-7',
  whatsapp:
    'M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6l-3.9.9Zm5-10.7c-.3 0-.8.3-.8 1.1s.8 2.3 2.4 3.6c1.5 1.3 2.6 1.6 3.2 1.5.6-.1 1-.6 1-1l-.1-.5-1.6-.8-.8.8c-.8-.3-1.8-1.2-2.2-2l.6-.9-.7-1.7-1-.1Z',
  instagram:
    'M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Zm4.5 5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-1.3v.1',
  facebook: 'M14 8.5h2.5V5H14a4 4 0 0 0-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9.5c0-.6.4-1 1-1Z',
} as const;

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName; title?: string };

export function Icon({ name, title, className = 'size-5', ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={paths[name]} />
    </svg>
  );
}
