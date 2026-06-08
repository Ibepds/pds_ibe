export type ParticipantRole = 'streamer' | 'artiste' | 'invite'
export type ScheduleType = 'stream' | 'show' | 'pause' | 'special'
export type FreestyleStatus = 'pending' | 'validated' | 'rejected'

export interface EventDoc {
  name: string
  tagline: string
  organizerName: string
  logoUrl?: string
  startDate: string
  endDate: string
  donationGoal: number
  currentAmount: number
  donorsCount: number
  liveUrl: string
  youtubeUrl?: string
  tiktokUrl?: string
  ebayLiveUrl?: string
  donationUrl: string
  isLive: boolean
  heroTitle: string
  heroSubtitle: string
  createdAt?: string
  updatedAt?: string
}

export interface Participant {
  id: string
  pseudo: string
  avatarUrl: string
  role: ParticipantRole
  category: string
  twitchUrl?: string
  instagramUrl?: string
  amountRaised: number
  isFeatured: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ScheduleItem {
  id: string
  day: string
  time: string
  title: string
  description: string
  type: ScheduleType
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface Donation {
  id: string
  username: string
  amount: number
  message: string
  createdAt: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface KeyNumber {
  label: string
  value: string
}

export interface AssociationDoc {
  id?: string
  name: string
  description: string
  logoUrl: string
  websiteUrl: string
  mission: string
  keyNumbers: KeyNumber[]
  createdAt?: string
  updatedAt?: string
}

export interface PresentationConceptCard {
  icon: string
  title: string
  text: string
}

export interface PresentationPlatform {
  icon: string
  name: string
}

export interface PresentationDoc {
  id?: string
  eventText: string
  porteurText: string
  conceptCards: PresentationConceptCard[]
  platforms: PresentationPlatform[]
  createdAt?: string
  updatedAt?: string
}

export interface ProgrammeDoc {
  id?: string
  subtitle: string
  createdAt?: string
  updatedAt?: string
}

export interface EncheresLot {
  title: string
  description: string
}

export interface EncheresDoc {
  id?: string
  intro: string
  lots: EncheresLot[]
  planningText: string
  createdAt?: string
  updatedAt?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export interface LegalDoc {
  id?: string
  editorLegalForm: string
  editorAddress: string
  editorSiret: string
  publicationDirector: string
  contactEmail: string
  hostName: string
  hostAddress: string
  retentionMonths: string
  privacyUpdatedAt: string
  createdAt?: string
  updatedAt?: string
}

export interface FreestyleSlot {
  id: string
  label: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface FreestyleBooking {
  id: string
  pseudo: string
  email: string
  socialLinks?: string
  slot: string
  trackUrl: string
  message?: string
  status: FreestyleStatus
  createdAt: string
  updatedAt?: string
}
