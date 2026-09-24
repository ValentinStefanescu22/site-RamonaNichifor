import type { ProductInput } from './schemas';

// Collection of the butterfly universe. Everything except the printed book is
// either „coming soon” or „order by message” for now.
export const products: ProductInput[] = [
  {
    id: 'butterfly-book-print',
    slug: { ro: 'fluturele-dansator-de-step-carte', en: 'the-tap-dancing-butterfly-book' },
    type: 'book',
    name: { ro: 'Fluturele dansator de step', en: 'The Tap-Dancing Butterfly' },
    shortDescription: { ro: 'Cartea tipărită', en: 'Printed book' },
    universeId: 'butterfly',
    bookId: 'book-butterfly',
    images: [
      {
        key: 'cover-butterfly',
        alt: {
          ro: 'Coperta cărții „Fluturele dansator de step”',
          en: 'Cover of “The Tap-Dancing Butterfly”',
        },
      },
    ],
    status: 'available',
    purchaseOptions: [
      // TODO(ramona): eMAG and Amazon links.
      { kind: 'external_retailer', retailerId: 'emag' },
      { kind: 'external_retailer', retailerId: 'amazon' },
      { kind: 'contact_inquiry', channel: 'whatsapp' },
    ],
    order: 1,
  },
  {
    id: 'butterfly-ebook',
    slug: { ro: 'fluturele-dansator-de-step-ebook', en: 'the-tap-dancing-butterfly-ebook' },
    type: 'ebook',
    name: { ro: 'Fluturele dansator de step', en: 'The Tap-Dancing Butterfly' },
    universeId: 'butterfly',
    bookId: 'book-butterfly',
    images: [],
    status: 'coming_soon',
    purchaseOptions: [],
    order: 2,
  },
  {
    id: 'butterfly-audiobook',
    slug: { ro: 'fluturele-dansator-de-step-audiobook', en: 'the-tap-dancing-butterfly-audiobook' },
    type: 'audiobook',
    name: { ro: 'Fluturele dansator de step', en: 'The Tap-Dancing Butterfly' },
    universeId: 'butterfly',
    bookId: 'book-butterfly',
    images: [],
    status: 'coming_soon',
    purchaseOptions: [],
    order: 3,
  },
  {
    id: 'butterfly-bookmarks',
    slug: { ro: 'semne-de-carte-fluturele', en: 'butterfly-bookmarks' },
    type: 'bookmark',
    name: { ro: 'Semne de carte cu fluturele', en: 'Butterfly bookmarks' },
    universeId: 'butterfly',
    images: [],
    status: 'made_to_order',
    purchaseOptions: [{ kind: 'contact_inquiry', channel: 'whatsapp' }],
    order: 4,
  },
  {
    id: 'butterfly-card-game',
    slug: { ro: 'carti-de-joc-fluturele', en: 'butterfly-playing-cards' },
    type: 'card_game',
    name: { ro: 'Cărți de joc cu fluturele', en: 'Butterfly playing cards' },
    universeId: 'butterfly',
    images: [],
    status: 'coming_soon',
    purchaseOptions: [],
    order: 5,
  },
  {
    id: 'butterfly-family-game',
    slug: { ro: 'joc-de-familie-fluturele', en: 'butterfly-family-game' },
    type: 'family_game',
    name: { ro: 'Joc de familie', en: 'Family game' },
    universeId: 'butterfly',
    images: [],
    status: 'coming_soon',
    purchaseOptions: [],
    order: 6,
  },
  {
    id: 'butterfly-mug',
    slug: { ro: 'cana-ceramica-handmade', en: 'handmade-ceramic-mug' },
    type: 'ceramic',
    name: { ro: 'Cană de ceramică handmade', en: 'Handmade ceramic mug' },
    shortDescription: {
      ro: 'Lucrată manual, fiecare cană e unică.',
      en: 'Made by hand, every mug is one of a kind.',
    },
    universeId: 'butterfly',
    images: [
      {
        key: 'mug-handmade',
        alt: {
          ro: 'Cană de ceramică handmade, verde-pal, cu o mică cireașă pe toartă',
          en: 'Pale green handmade ceramic mug with a small cherry on the handle',
        },
      },
    ],
    status: 'made_to_order',
    purchaseOptions: [{ kind: 'contact_inquiry', channel: 'whatsapp' }],
    order: 7,
  },
];
