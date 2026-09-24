import type { BookInput } from './schemas';

// English titles are WORKING TRANSLATIONS, to be confirmed by Ramona.
export const books: BookInput[] = [
  {
    id: 'book-butterfly',
    title: { ro: 'Fluturele dansator de step', en: 'The Tap-Dancing Butterfly' },
    subtitle: {
      ro: 'O poveste pentru copii… o șoaptă pentru adulți',
      en: 'A story for children… a whisper for grown-ups',
    },
    seriesId: 'magic',
    seriesNumber: 1,
    universeId: 'butterfly',
    audience: 'kids',
    status: 'published',
    cover: {
      key: 'cover-butterfly',
      alt: {
        ro: 'Coperta cărții „Fluturele dansator de step”: un fluture roz pictat în acuarelă deasupra unei pajiști cu flori',
        en: 'Cover of “The Tap-Dancing Butterfly”: a pink watercolour butterfly above a meadow of flowers',
      },
    },
    editions: [{ language: 'ro', format: 'print', isbn: '978-973-0-44382-0', year: 2026 }],
  },
  {
    id: 'book-ladybug',
    title: { ro: 'Buburuza Rotunjoară', en: 'Roundy the Ladybug' },
    seriesId: 'magic',
    seriesNumber: 2,
    universeId: 'ladybug',
    audience: 'kids',
    status: 'coming_soon',
    editions: [],
  },
  {
    id: 'book-mosquito',
    title: { ro: 'Țânțarul cu cizme de cauciuc', en: 'The Mosquito in Rubber Boots' },
    seriesId: 'magic',
    seriesNumber: 3,
    universeId: 'mosquito',
    audience: 'kids',
    status: 'coming_soon',
    editions: [],
  },
  {
    id: 'book-fly',
    title: { ro: 'Musca rătăcită', en: 'The Lost Fly' },
    seriesId: 'magic',
    seriesNumber: 4,
    universeId: 'fly',
    audience: 'kids',
    status: 'coming_soon',
    editions: [],
  },
];
