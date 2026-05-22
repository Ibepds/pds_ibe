import type {
  AssociationDoc,
  Donation,
  EventDoc,
  FaqItem,
  Participant,
  ScheduleItem,
} from '~/types'

export const MOCK_EVENT: EventDoc = {
  name: 'Ibé Solidarité Live',
  tagline: 'Un week-end de streams et de créativité au profit des enfants',
  organizerName: 'Ibé PDS',
  startDate: '2026-06-14T18:00:00',
  endDate: '2026-06-16T23:59:00',
  donationGoal: 50000,
  currentAmount: 28450,
  donorsCount: 412,
  liveUrl: 'https://www.twitch.tv/',
  donationUrl: 'https://www.helloasso.com/',
  isLive: true,
  heroTitle: 'Ensemble, faisons la différence',
  heroSubtitle:
    'Streamers, artistes et invités spéciaux réunis par Ibé PDS pour une cause qui nous tient à cœur.',
}

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    pseudo: 'NovaStream',
    avatarUrl: '',
    role: 'streamer',
    category: 'FPS & variété',
    twitchUrl: 'https://twitch.tv',
    amountRaised: 4200,
    isFeatured: true,
  },
  {
    id: '2',
    pseudo: 'LunaPaint',
    avatarUrl: '',
    role: 'artiste',
    category: 'Illustration live',
    instagramUrl: 'https://instagram.com',
    amountRaised: 3100,
    isFeatured: true,
  },
  {
    id: '3',
    pseudo: 'ChefKarma',
    avatarUrl: '',
    role: 'invite',
    category: 'Invité spécial',
    amountRaised: 1800,
    isFeatured: true,
  },
  {
    id: '4',
    pseudo: 'PixelFox',
    avatarUrl: '',
    role: 'streamer',
    category: 'Rétro gaming',
    twitchUrl: 'https://twitch.tv',
    amountRaised: 2650,
    isFeatured: false,
  },
  {
    id: '5',
    pseudo: 'EchoVoice',
    avatarUrl: '',
    role: 'artiste',
    category: 'Musique acoustique',
    amountRaised: 1950,
    isFeatured: false,
  },
  {
    id: '6',
    pseudo: 'Dr.Helix',
    avatarUrl: '',
    role: 'invite',
    category: 'Association partenaire',
    amountRaised: 900,
    isFeatured: false,
  },
]

export const MOCK_SCHEDULE: ScheduleItem[] = [
  {
    id: '1',
    day: 'Vendredi 14 juin',
    time: '18:00',
    title: 'Ouverture officielle',
    description: 'Lancement de l\'événement avec Ibé PDS et les premiers streams.',
    type: 'special',
    order: 1,
  },
  {
    id: '2',
    day: 'Vendredi 14 juin',
    time: '20:00',
    title: 'Marathon FPS solidaire',
    description: 'Tournois communautaire avec dons en direct.',
    type: 'stream',
    order: 2,
  },
  {
    id: '3',
    day: 'Samedi 15 juin',
    time: '14:00',
    title: 'Atelier créatif live',
    description: 'Session illustration en direct avec les viewers.',
    type: 'show',
    order: 3,
  },
  {
    id: '4',
    day: 'Samedi 15 juin',
    time: '22:00',
    title: 'Concert acoustique',
    description: 'Performance live au profit de l\'association.',
    type: 'show',
    order: 4,
  },
  {
    id: '5',
    day: 'Dimanche 16 juin',
    time: '16:00',
    title: 'Pause & bilan intermédiaire',
    description: 'Point sur les dons et annonces spéciales.',
    type: 'pause',
    order: 5,
  },
  {
    id: '6',
    day: 'Dimanche 16 juin',
    time: '21:00',
    title: 'Grande finale',
    description: 'Clôture de l\'événement et annonce du montant total.',
    type: 'special',
    order: 6,
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
    message: 'Pour les enfants ❤️',
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
      'Rendez-vous sur la page Faire un don ou cliquez sur le bouton dédié dans le header. Vous serez redirigé vers notre plateforme sécurisée HelloAsso.',
    order: 1,
  },
  {
    id: '2',
    question: 'Où va l\'argent collecté ?',
    answer:
      '100 % des dons sont reversés à l\'association partenaire de l\'événement, après déduction des frais de plateforme de paiement.',
    order: 2,
  },
  {
    id: '3',
    question: 'Puis-je participer en tant que streamer ?',
    answer:
      'Les participations sont sur invitation. Contactez Ibé PDS via les réseaux sociaux pour les prochaines éditions.',
    order: 3,
  },
  {
    id: '4',
    question: 'L\'événement est-il diffusé en direct ?',
    answer:
      'Oui ! Pendant les créneaux live, retrouvez la diffusion sur Twitch ou YouTube via le lien affiché sur la page d\'accueil.',
    order: 4,
  },
]

export const MOCK_ASSOCIATION: AssociationDoc = {
  name: 'Les Petits Rayons',
  description:
    'Association loi 1901 qui accompagne les enfants hospitalisés grâce à des ateliers créatifs, du matériel adapté et des moments de répit pour les familles.',
  logoUrl: '',
  websiteUrl: 'https://example.org',
  mission:
    'Apporter de la lumière et du réconfort aux enfants et à leurs proches pendant le parcours de soins.',
  keyNumbers: [
    { label: 'Enfants accompagnés', value: '2 400+' },
    { label: 'Ateliers par an', value: '180' },
    { label: 'Bénévoles actifs', value: '95' },
    { label: 'Hôpitaux partenaires', value: '12' },
  ],
}

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
