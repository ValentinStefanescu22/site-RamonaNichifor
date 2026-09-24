import type { BookVM } from '@/lib/data';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { ImagePlaceholder } from '@/components/ui/ComingSoon';

type Props = { book: BookVM; placeholderLabel: string; sizes: string; priority?: boolean };

/** Real cover if we have one, otherwise a clearly labelled placeholder (never an invented cover). */
export function BookCover({ book, placeholderLabel, sizes, priority }: Props) {
  if (book.cover) {
    return (
      <ResponsiveImage
        image={book.cover}
        sizes={sizes}
        priority={priority}
        className="aspect-[2/3] w-full object-cover"
      />
    );
  }
  return <ImagePlaceholder label={placeholderLabel} title={book.title} />;
}
