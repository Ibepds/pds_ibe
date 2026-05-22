export type ParticipantRole = 'streamer' | 'artiste' | 'invite'
export type ScheduleType = 'stream' | 'show' | 'pause' | 'special'

export interface EventDoc {
  name: string
  tagline: string
  organizerName: string
  startDate: string
  endDate: string
  donationGoal: number
  currentAmount: number
  donorsCount: number
  liveUrl: string
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
  name: string
  description: string
  logoUrl: string
  websiteUrl: string
  mission: string
  keyNumbers: KeyNumber[]
  createdAt?: string
  updatedAt?: string
}
