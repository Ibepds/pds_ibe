import type {
  AssociationDoc,
  Donation,
  EventDoc,
  FaqItem,
  FreestyleBooking,
  Participant,
  ScheduleItem,
} from '~/types'

export const MOCK_EVENT: EventDoc = {
  name: 'PDS Humanity',
  tagline: 'Un marathon de 24h de musique et de solidarité pour une cause qui nous tient à cœur',
  organizerName: 'PDS Records / Ibé',
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
    time: '18:00',
    title: 'Ouverture officielle — PDS Humanity',
    description: 'Lancement du marathon caritatif avec PDS Records et Ibé.',
    type: 'special',
    order: 1,
  },
  {
    id: '2',
    day: 'Vendredi 27 juin',
    time: '20:00',
    title: 'Performances musicales & lives',
    description: 'Concerts en direct, freestyles et moments forts de collecte de dons.',
    type: 'show',
    order: 2,
  },
  {
    id: '3',
    day: 'Samedi 28 juin',
    time: '04:00',
    title: 'Freestyles nocturnes',
    description: '50 créneaux de 6 minutes ouverts au public pour performer en live.',
    type: 'stream',
    order: 3,
  },
  {
    id: '4',
    day: 'Samedi 28 juin',
    time: '10:00',
    title: 'Ventes aux enchères solidaires',
    description: 'Enchères live sur eBay Live — lots exclusifs au profit des associations.',
    type: 'special',
    order: 4,
  },
  {
    id: '5',
    day: 'Samedi 28 juin',
    time: '16:00',
    title: 'Bilan & clôture',
    description: 'Annonce du montant total collecté et remerciements.',
    type: 'special',
    order: 5,
  },
]

export const MOCK_DONATIONS: Donation[] = [
  {
    id: '1',
    username: 'Camille42',
    amount: 50,
    message: 'Bravo pour cette initiative !',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    username: 'MaxDu93',
    amount: 25,
    message: 'On est avec vous 💜',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    username: 'Anonyme',
    amount: 100,
    message: 'Pour une bonne cause ❤️',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '4',
    username: 'StreamFan',
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
      'Rendez-vous sur la page "Réservation freestyles" et remplissez le formulaire. Choisissez votre créneau parmi les disponibilités (4h-9h), ajoutez un lien vers votre morceau. Votre participation sera validée manuellement par l\'organisateur.',
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
    logoUrl: '',
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
    logoUrl: '',
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

export const MOCK_FREESTYLE_BOOKINGS: FreestyleBooking[] = []

export const FREESTYLE_SLOTS: string[] = [
  '4h00', '4h06', '4h12', '4h18', '4h24', '4h30', '4h36', '4h42', '4h48', '4h54',
  '5h00', '5h06', '5h12', '5h18', '5h24', '5h30', '5h36', '5h42', '5h48', '5h54',
  '6h00', '6h06', '6h12', '6h18', '6h24', '6h30', '6h36', '6h42', '6h48', '6h54',
  '7h00', '7h06', '7h12', '7h18', '7h24', '7h30', '7h36', '7h42', '7h48', '7h54',
  '8h00', '8h06', '8h12', '8h18', '8h24', '8h30', '8h36', '8h42', '8h48', '8h54',
]

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
