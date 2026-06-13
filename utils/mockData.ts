import type {
  AssociationDoc,
  ContactMessage,
  Donation,
  EncheresDoc,
  EventDoc,
  FaqItem,
  FreestyleBooking,
  FreestyleSlot,
  LegalDoc,
  Participant,
  PresentationDoc,
  ProgrammeDoc,
  ScheduleItem,
} from '~/types'

export const MOCK_EVENT: EventDoc = {
  name: 'PDS Humanity',
  tagline: 'Un marathon de 24h de musique et de solidarité pour une cause qui nous tient à cœur',
  organizerName: 'PDS Records / Ibé',
  logoUrl: '',
  startDate: '2026-06-27T18:00:00',
  endDate: '2026-06-28T18:00:00',
  donationGoal: 50000,
  currentAmount: 0,
  donorsCount: 0,
  liveUrl: 'https://www.twitch.tv/',
  youtubeUrl: 'https://www.youtube.com/',
  tiktokUrl: 'https://www.tiktok.com/',
  ebayLiveUrl: 'https://www.ebay.fr/',
  donationUrl: 'https://www.helloasso.com/',
  isLive: false,
  heroTitle: 'Ensemble, faisons la différence',
  heroSubtitle:
    'PDS Records et Ibé réunissent artistes et communauté pendant 24h pour soutenir des associations caritatives.',
  tickerItems: ['LIVE 24H', 'GROS DONS !', 'ASSOCIATIONS CARITATIVES', 'STREAM BY IBÉ'],
}

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    pseudo: 'Ibé',
    avatarUrl: '',
    role: 'artiste',
    category: 'Musique / Rap',
    instagramUrl: 'https://instagram.com',
    amountRaised: 0,
    isFeatured: true,
  },
]

export const MOCK_SCHEDULE: ScheduleItem[] = [
  {
    id: '1',
    day: 'Vendredi 27 juin',
    time: '18:05',
    title: 'Table ronde',
    description: '+ Guest surprise',
    type: 'special',
    order: 1,
  },
  {
    id: '2',
    day: 'Vendredi 27 juin',
    time: '19:30',
    title: 'Enchère solidaire #01',
    description: '',
    type: 'special',
    order: 2,
  },
  {
    id: '3',
    day: 'Vendredi 27 juin',
    time: '20:00',
    title: 'Giga concept',
    description: '',
    type: 'show',
    order: 3,
  },
  {
    id: '4',
    day: 'Samedi 28 juin',
    time: '03:00',
    title: 'Freestyles nocturnes',
    description: 'Toute la nuit / 56 artistes',
    type: 'stream',
    order: 4,
  },
  {
    id: '5',
    day: 'Samedi 28 juin',
    time: '',
    title: 'Enchère finale',
    description: 'Un lot exceptionnel',
    type: 'special',
    order: 5,
  },
]

export const MOCK_DONATIONS: Donation[] = [
  {
    id: '1',
    username: 'Camille42',
    email: 'camille@example.com',
    amount: 50,
    message: 'Bravo pour cette initiative !',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    username: 'MaxDu93',
    email: 'max@example.com',
    amount: 25,
    message: 'On est avec vous',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    username: 'Anonyme',
    email: 'donateur.anonyme@example.com',
    amount: 100,
    message: 'Pour une bonne cause',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '4',
    username: 'StreamFan',
    email: 'streamfan@example.com',
    amount: 15,
    message: '',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
]

export const MOCK_FAQ: FaqItem[] = [
  {
    id: '1',
    question: 'Comment faire un don ?',
    answer:
      'Cliquez sur le bouton "Faire un don" présent sur toutes les pages. Vous serez redirigé vers notre plateforme sécurisée de collecte en ligne.',
    order: 1,
  },
  {
    id: '2',
    question: 'Où va l\'argent collecté ?',
    answer:
      '100 % des fonds récoltés (dons + enchères) sont reversés aux associations partenaires de l\'événement, après déduction des frais de plateforme de paiement.',
    order: 2,
  },
  {
    id: '3',
    question: 'Comment participer aux freestyles nocturnes ?',
    answer:
      'Rendez-vous sur la page "Réservation freestyles" et remplissez le formulaire. Choisissez votre créneau parmi les disponibilités (03h00 → 10h29), ajoutez un lien vers votre morceau. Votre participation sera validée manuellement par l\'organisateur.',
    order: 3,
  },
  {
    id: '4',
    question: 'Comment participer aux ventes aux enchères ?',
    answer:
      'Les enchères se déroulent en direct sur eBay Live. Rendez-vous sur la page "Enchères" pour accéder au lien de la vente et voir les lots disponibles.',
    order: 4,
  },
  {
    id: '5',
    question: 'Sur quelles plateformes l\'événement est-il diffusé ?',
    answer:
      'PDS Humanity est diffusé en direct sur Twitch, YouTube et TikTok. Les liens sont disponibles sur la page d\'accueil et dans le programme.',
    order: 5,
  },
  {
    id: '6',
    question: 'Puis-je contacter l\'équipe organisatrice ?',
    answer:
      'Oui, utilisez le formulaire de contact disponible sur la page "Contact" pour toute demande : presse, partenariats ou informations générales.',
    order: 6,
  },
]

export const MOCK_ASSOCIATIONS: (AssociationDoc & { id: string })[] = [
  {
    id: 'asso-1',
    name: 'Association partenaire 1',
    description: 'Description de la première association partenaire de PDS Humanity. Les fonds collectés soutiendront leurs actions sur le terrain.',
    logoUrl: '/images/da/cgpt/picto-7-cgpt.png',
    websiteUrl: '',
    mission: 'À préciser — descriptif en cours de collecte.',
    keyNumbers: [
      { label: 'Bénéficiaires', value: 'À définir' },
      { label: 'Projets', value: 'À définir' },
    ],
  },
  {
    id: 'asso-2',
    name: 'Association partenaire 2',
    description: 'Description de la deuxième association partenaire de PDS Humanity. Chaque don contribue directement à leur mission.',
    logoUrl: '/images/da/cgpt/picto-7-cgpt.png',
    websiteUrl: '',
    mission: 'À préciser — descriptif en cours de collecte.',
    keyNumbers: [
      { label: 'Bénéficiaires', value: 'À définir' },
      { label: 'Projets', value: 'À définir' },
    ],
  },
]

// Kept for backward compatibility with admin/association page
export const MOCK_ASSOCIATION: AssociationDoc = MOCK_ASSOCIATIONS[0]

export const MOCK_PRESENTATION: PresentationDoc = {
  eventText:
    "PDS Humanity est un marathon caritatif de 24 heures mêlant musique et solidarité. L'événement se tient du 27 juin (18h) au 28 juin (18h) et est diffusé en direct sur Twitch, YouTube et TikTok.\n\nPendant 24h se succèdent performances musicales, freestyles, contenus en direct et temps forts de collecte de dons. Trois leviers de mobilisation sont réunis : la cagnotte de dons en ligne, les ventes aux enchères solidaires sur eBay Live et les freestyles nocturnes ouverts au public.",
  porteurText:
    "PDS Records est un label indépendant fondé par Ibé, artiste engagé et producteur. PDS Humanity est produit et organisé en interne par PDS Records / Ibé, avec la conviction que la musique peut être un puissant vecteur de solidarité.",
  conceptCards: [
    { icon: 'cgpt.musicNote', title: 'Musique live', text: 'Performances, freestyles et concerts en direct tout au long du marathon de 24h.' },
    { icon: 'picto.heart', title: 'Solidarité', text: '100% des fonds collectés reversés aux associations partenaires.' },
    { icon: 'cgpt.gift', title: 'Enchères', text: 'Ventes aux enchères solidaires en direct sur eBay Live avec des lots exclusifs.' },
  ],
  platforms: [
    { icon: 'cgpt.sparkles', name: 'Twitch' },
    { icon: 'cgpt.star', name: 'YouTube' },
    { icon: 'cgpt.musicNoteSm', name: 'TikTok' },
    { icon: 'cgpt.gift', name: 'eBay Live' },
  ],
}

export const MOCK_LEGAL: LegalDoc = {
  editorLegalForm: '',
  editorAddress: '',
  editorSiret: '',
  publicationDirector: 'Ibé',
  contactEmail: '',
  hostName: '',
  hostAddress: '',
  retentionMonths: '12',
  privacyUpdatedAt: 'juin 2026',
}

export const MOCK_PROGRAMME: ProgrammeDoc = {
  subtitle: 'Le déroulé complet du marathon de 24h — 27 juin 18h → 28 juin 18h.',
}

export const MOCK_ENCHERES: EncheresDoc = {
  intro:
    "Pendant le marathon PDS Humanity, des ventes aux enchères solidaires sont organisées en direct sur eBay Live. Les lots — exclusifs et uniques — sont mis aux enchères en temps réel devant les spectateurs.\n\n100% des fonds issus des enchères sont reversés aux associations partenaires de l'événement. Chaque enchère est un acte de solidarité.",
  lots: [],
  planningText:
    "Le planning des sessions d'enchères sera communiqué avant l'événement.",
}

export const MOCK_CONTACTS: ContactMessage[] = []

export const MOCK_FREESTYLE_BOOKINGS: FreestyleBooking[] = []

const FREESTYLE_SLOT_LABELS: string[] = [
  '03h00 – 03h08', '03h08 – 03h16', '03h16 – 03h24', '03h24 – 03h32',
  '03h32 – 03h40', '03h40 – 03h48', '03h48 – 03h56', '03h56 – 04h04',
  '04h04 – 04h12', '04h12 – 04h20', '04h20 – 04h28', '04h28 – 04h36',
  '04h36 – 04h44', '04h44 – 04h52', '04h52 – 05h00', '05h00 – 05h08',
  '05h08 – 05h16', '05h16 – 05h24', '05h24 – 05h32', '05h32 – 05h40',
  '05h40 – 05h48', '05h48 – 05h56', '05h56 – 06h04', '06h04 – 06h12',
  '06h12 – 06h20', '06h20 – 06h28', '06h28 – 06h36', '06h36 – 06h44',
  '06h44 – 06h52', '06h52 – 07h00', '07h00 – 07h08', '07h08 – 07h16',
  '07h16 – 07h24', '07h24 – 07h32', '07h32 – 07h40', '07h40 – 07h48',
  '07h48 – 07h56', '07h56 – 08h04', '08h04 – 08h12', '08h12 – 08h20',
  '08h20 – 08h28', '08h28 – 08h36', '08h36 – 08h44', '08h44 – 08h52',
  '08h52 – 09h00', '09h00 – 09h08', '09h08 – 09h16', '09h16 – 09h24',
  '09h24 – 09h32', '09h32 – 09h40', '09h40 – 09h48', '09h48 – 09h56',
  '09h56 – 10h04', '10h04 – 10h12', '10h12 – 10h20', '10h20 – 10h29',
]

export const MOCK_FREESTYLE_SLOTS: FreestyleSlot[] = FREESTYLE_SLOT_LABELS.map(
  (label, i) => ({
    id: `slot-${i + 1}`,
    label,
    order: i + 1,
  }),
)

export const ROLE_LABELS: Record<string, string> = {
  streamer: 'Streamer',
  artiste: 'Artiste',
  invite: 'Invité',
  all: 'Tous',
}

export const FILTER_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'streamer', label: 'Streamers' },
  { value: 'artiste', label: 'Artistes' },
  { value: 'invite', label: 'Invités' },
] as const
