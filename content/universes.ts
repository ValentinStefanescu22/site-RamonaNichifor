import type { UniverseInput } from './schemas';

// Story texts are DRAFTS adapted from the back cover; accent colours are proposals.
export const universes: UniverseInput[] = [
  {
    id: 'butterfly',
    slug: { ro: 'fluturele-dansator-de-step', en: 'the-tap-dancing-butterfly' },
    bookId: 'book-butterfly',
    tagline: {
      ro: 'Despre curajul de a-ți urma propriul ritm.',
      en: 'About the courage to follow your own rhythm.',
    },
    story: {
      ro: [
        'Într-o poiană magică și plină de culoare, un fluture simte un ritm diferit de al celorlalți. În timp ce toți se așteptau să zboare lin și grațios, asemenea întregii sale familii de balerini, inima lui visa la altceva.',
        'Întâlnește prieteni noi, înfruntă îndoieli și învață să își asculte vocea interioară.',
        'Pentru copii, aceasta este o poveste blândă despre încrederea în sine, despre explorarea lumii cu curaj și despre înțelegerea emoțiilor cu delicatețe. Pentru adulți, drumul fluturelui aduce o reflecție mai profundă, amintindu-ne să privim dincolo de frică, așteptări și tipare vechi.',
      ],
      en: [
        'In a magical, colourful meadow, a butterfly feels a rhythm different from everyone else’s. While all expected him to fly smoothly and gracefully, like his whole family of ballet dancers, his heart dreamed of something else.',
        'He meets new friends, faces his doubts and learns to listen to his inner voice.',
        'For children, it is a gentle story about self-confidence, exploring the world with courage and understanding emotions with care. For adults, the butterfly’s journey offers a deeper reflection, reminding us to look beyond fear, expectations and old patterns.',
      ],
    },
    accentColor: '#b27bb8',
    status: 'published',
    order: 1,
  },
  {
    id: 'ladybug',
    slug: { ro: 'buburuza-rotunjoara', en: 'roundy-the-ladybug' },
    bookId: 'book-ladybug',
    tagline: { ro: 'O nouă poveste, în curând.', en: 'A new story, coming soon.' },
    story: { ro: [], en: [] },
    accentColor: '#d9826f',
    status: 'coming_soon',
    order: 2,
  },
  {
    id: 'mosquito',
    slug: { ro: 'tantarul-cu-cizme-de-cauciuc', en: 'the-mosquito-in-rubber-boots' },
    bookId: 'book-mosquito',
    tagline: { ro: 'O nouă poveste, în curând.', en: 'A new story, coming soon.' },
    story: { ro: [], en: [] },
    accentColor: '#5f9aa8',
    status: 'coming_soon',
    order: 3,
  },
  {
    id: 'fly',
    slug: { ro: 'musca-ratacita', en: 'the-lost-fly' },
    bookId: 'book-fly',
    tagline: { ro: 'O nouă poveste, în curând.', en: 'A new story, coming soon.' },
    story: { ro: [], en: [] },
    accentColor: '#8aa383',
    status: 'coming_soon',
    order: 4,
  },
];
