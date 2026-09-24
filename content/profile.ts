import type { ProfileInput } from './schemas';

// All texts are DRAFTS based on the prototype; to be reviewed by Ramona (RO) and validated (EN).
export const profile: ProfileInput = {
  name: 'Ramona Nichifor',
  hero: {
    roles: {
      ro: ['Autor · Ilustrator · Antreprenor', 'Consilier pentru dezvoltare personală'],
      en: ['Author · Illustrator · Entrepreneur', 'Personal development counsellor'],
    },
    lines: {
      ro: [
        'Între rațiune și _intuiție._',
        'Între cuvânt și _imagine._',
        'Între ceea ce știm',
        'și ceea ce _simțim._',
      ],
      en: [
        'Between reason and _intuition._',
        'Between word and _image._',
        'Between what we know',
        'and what we _feel._',
      ],
    },
    cta: { ro: 'Descoperă universul meu', en: 'Discover my universe' },
    photo: {
      key: 'portrait',
      alt: { ro: 'Portretul Ramonei Nichifor', en: 'Portrait of Ramona Nichifor' },
    },
    shortcuts: [
      {
        id: 'kids-books',
        icon: 'book',
        label: { ro: 'Cărți pentru copii', en: "Children's books" },
        target: { kind: 'booksByAudience', audience: 'kids' },
      },
      {
        id: 'art',
        icon: 'brush',
        label: { ro: 'Picturi și ilustrații', en: 'Paintings & illustrations' },
        target: { kind: 'page', page: 'art' },
      },
      {
        id: 'personal-development',
        icon: 'sprout',
        label: { ro: 'Dezvoltare personală', en: 'Personal development' },
        target: { kind: 'role', role: 'counselor' },
      },
      {
        id: 'community',
        icon: 'heart',
        label: { ro: 'O comunitate cu sens', en: 'A meaningful community' },
        target: { kind: 'page', page: 'contact' },
      },
    ],
  },
  roles: [
    {
      id: 'counselor',
      // TODO(ramona): exact title from her certificates. Never „psiholog” / „psihoterapeut”.
      title: { ro: 'Consilier pentru dezvoltare personală', en: 'Personal development counsellor' },
      anchor: { ro: 'consilier', en: 'counsellor' },
      summary: {
        ro: 'Un spațiu pentru întrebări bune, claritate și libertatea de a privi dincolo de rolurile cunoscute.',
        en: 'A space for good questions, clarity and the freedom to look beyond familiar roles.',
      },
      body: {
        ro: [
          'Formarea juridică, experiența antreprenorială și studiile în dezvoltare personală mi-au oferit perspective diferite asupra schimbării.',
          'Mă interesează conversațiile care aduc claritate, conștientizare și libertatea de a privi dincolo de rolurile cunoscute.',
        ],
        en: [
          'A background in law, years as an entrepreneur and my studies in personal development have given me different perspectives on change.',
          'I care about conversations that bring clarity, awareness and the freedom to look beyond familiar roles.',
        ],
      },
    },
    {
      id: 'author',
      title: { ro: 'Autor', en: 'Author' },
      anchor: { ro: 'autor', en: 'author' },
      summary: {
        ro: 'Povești blânde despre curaj, identitate și apartenență, pentru suflete mici și mari.',
        en: 'Gentle stories about courage, identity and belonging, for little and grown-up souls.',
      },
      body: {
        ro: [
          'Sunt mamă a două fiice; din poveștile spuse seara uneia dintre ele s-a născut universul _Magia suntem noi_.',
        ],
        en: [
          'I am the mother of two daughters; the _We Are the MAGIC_ universe was born from the bedtime stories I told one of them.',
        ],
      },
    },
    {
      id: 'artist',
      title: { ro: 'Artist', en: 'Artist' },
      anchor: { ro: 'artist', en: 'artist' },
      summary: {
        ro: 'Picturi și ilustrații care pornesc din culoare, emoție și întrebările care nu au nevoie de răspuns imediat.',
        en: "Paintings and illustrations born from colour, emotion and the questions that don't need an answer right away.",
      },
      body: {
        ro: ['Pictez în acrilic și acuarelă și ilustrez singură poveștile pe care le scriu.'],
        en: ['I paint in acrylic and watercolour and illustrate the stories I write myself.'],
      },
    },
    {
      id: 'entrepreneur',
      title: { ro: 'Antreprenor', en: 'Entrepreneur' },
      anchor: { ro: 'antreprenor', en: 'entrepreneur' },
      summary: {
        ro: 'Din drept și afaceri către creație: proiecte construite cu răbdare și sens.',
        en: 'From law and business to creative work: projects built with patience and purpose.',
      },
      body: {
        ro: [
          'Am absolvit Facultatea de Drept, am lucrat în domeniul juridic și am construit proiecte ca antreprenor.',
        ],
        en: ['I studied law, worked in the legal field and built projects as an entrepreneur.'],
      },
    },
  ],
  // TODO(ramona): WhatsApp number, e-mail, Instagram and Facebook URLs.
  contact: {},
  social: {},
};
