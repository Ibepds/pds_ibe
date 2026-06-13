import { DA } from './daAssets'

export type DaIconKey =
  | 'picto.highFive'
  | 'picto.children'
  | 'picto.gift'
  | 'picto.heart'
  | 'picto.heartSm'
  | 'picto.plane'
  | 'picto.trophy'
  | 'picto.childrenGlobe'
  | 'cgpt.sparkles'
  | 'cgpt.ticket'
  | 'cgpt.heartOutline'
  | 'cgpt.dove'
  | 'cgpt.btnAuctions'
  | 'cgpt.childrenGlobe'
  | 'cgpt.assoLogo'
  | 'cgpt.chat'
  | 'cgpt.gift'
  | 'cgpt.microphone'
  | 'cgpt.crown'
  | 'cgpt.star'
  | 'cgpt.calendar'
  | 'cgpt.padlock'
  | 'cgpt.user'
  | 'cgpt.artist'
  | 'cgpt.userAlt'
  | 'cgpt.musicNote'
  | 'cgpt.musicNoteSm'
  | 'cgpt.check'

export const DA_ICON_OPTIONS: { key: DaIconKey; label: string }[] = [
  { key: 'picto.highFive', label: 'High five' },
  { key: 'picto.children', label: 'Enfants' },
  { key: 'picto.gift', label: 'Cadeau' },
  { key: 'picto.heart', label: 'Cœur' },
  { key: 'picto.heartSm', label: 'Petit cœur' },
  { key: 'picto.plane', label: 'Avion' },
  { key: 'picto.trophy', label: 'Trophée' },
  { key: 'picto.childrenGlobe', label: 'Globe enfants' },
  { key: 'cgpt.sparkles', label: 'Éclats' },
  { key: 'cgpt.ticket', label: 'Ticket' },
  { key: 'cgpt.heartOutline', label: 'Cœur contour' },
  { key: 'cgpt.dove', label: 'Colombe' },
  { key: 'cgpt.chat', label: 'Bulles / table ronde' },
  { key: 'cgpt.gift', label: 'Cadeau enchères' },
  { key: 'cgpt.microphone', label: 'Microphone' },
  { key: 'cgpt.crown', label: 'Couronne' },
  { key: 'cgpt.star', label: 'Étoile' },
  { key: 'cgpt.calendar', label: 'Calendrier' },
  { key: 'cgpt.padlock', label: 'Cadenas' },
  { key: 'cgpt.user', label: 'Profil' },
  { key: 'cgpt.musicNote', label: 'Musique' },
  { key: 'cgpt.check', label: 'Validation' },
]

const EMOJI_TO_KEY: Record<string, DaIconKey> = {
  '🎵': 'cgpt.musicNote',
  '❤️': 'picto.heart',
  '❤': 'picto.heart',
  '💜': 'picto.heart',
  '💝': 'picto.heart',
  '🏆': 'picto.trophy',
  '👑': 'cgpt.crown',
  '📺': 'cgpt.sparkles',
  '▶️': 'cgpt.sparkles',
  '▶': 'cgpt.sparkles',
  '🛒': 'cgpt.gift',
  '🎁': 'cgpt.gift',
  '🤝': 'picto.highFive',
  '📰': 'cgpt.sparkles',
  '💬': 'cgpt.chat',
  '📅': 'cgpt.calendar',
  '⏰': 'cgpt.calendar',
  '⏱️': 'cgpt.calendar',
  '⏱': 'cgpt.calendar',
  '🎤': 'cgpt.microphone',
  '✨': 'cgpt.star',
  '⭐': 'cgpt.star',
  '🔗': 'cgpt.ticket',
  '🔒': 'cgpt.padlock',
  '✅': 'cgpt.check',
  '✓': 'cgpt.check',
}

function getByPath(key: string): string | null {
  const parts = key.split('.')
  let cur: unknown = DA
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in cur) {
      cur = (cur as Record<string, unknown>)[part]
    } else {
      return null
    }
  }
  return typeof cur === 'string' ? cur : null
}

/** Résout une clé DA (`cgpt.padlock`) ou un emoji legacy vers le chemin PNG craie. */
export function resolveDaIconSrc(icon: string): string | null {
  if (!icon) return null
  const trimmed = icon.trim()
  const fromKey = getByPath(trimmed)
  if (fromKey) return fromKey
  const mapped = EMOJI_TO_KEY[trimmed]
  return mapped ? getByPath(mapped) : null
}
