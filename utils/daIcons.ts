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

export const DA_ICON_OPTIONS: { key: DaIconKey; label: string }[] = [
  { key: 'picto.highFive', label: 'High five' },
  { key: 'picto.children', label: 'Enfants' },
  { key: 'picto.gift', label: 'Cadeau' },
  { key: 'picto.heart', label: 'Cœur' },
  { key: 'picto.heartSm', label: 'Petit cœur' },
  { key: 'picto.plane', label: 'Avion' },
  { key: 'picto.trophy', label: 'Trophée' },
  { key: 'picto.childrenGlobe', label: 'Globe' },
  { key: 'cgpt.sparkles', label: 'Éclats' },
  { key: 'cgpt.ticket', label: 'Ticket' },
  { key: 'cgpt.heartOutline', label: 'Cœur contour' },
  { key: 'cgpt.dove', label: 'Colombe' },
]

const EMOJI_TO_KEY: Record<string, DaIconKey> = {
  '🎵': 'picto.highFive',
  '❤️': 'picto.heart',
  '❤': 'picto.heart',
  '💜': 'picto.heart',
  '💝': 'picto.heart',
  '🏆': 'picto.trophy',
  '📺': 'cgpt.sparkles',
  '▶️': 'cgpt.sparkles',
  '▶': 'cgpt.sparkles',
  '🛒': 'picto.gift',
  '🤝': 'picto.highFive',
  '📰': 'cgpt.sparkles',
  '💬': 'picto.highFive',
  '📅': 'cgpt.ticket',
  '⏰': 'cgpt.sparkles',
  '⏱️': 'picto.heartSm',
  '⏱': 'picto.heartSm',
  '✨': 'cgpt.sparkles',
  '🔗': 'cgpt.ticket',
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

/** Résout une clé DA (`picto.gift`) ou un emoji legacy vers le chemin PNG craie. */
export function resolveDaIconSrc(icon: string): string | null {
  if (!icon) return null
  const trimmed = icon.trim()
  const fromKey = getByPath(trimmed)
  if (fromKey) return fromKey
  const mapped = EMOJI_TO_KEY[trimmed]
  return mapped ? getByPath(mapped) : null
}
