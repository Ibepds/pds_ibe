/**
 * Limitation de débit best-effort par IP sur les routes /api/*.
 * Fenêtre glissante simple en mémoire (par instance serveur). Sur un hébergement
 * serverless les instances ne partagent pas la mémoire : c'est une couche de
 * défense supplémentaire, pas une protection absolue (à compléter par un WAF /
 * rate-limit côté plateforme pour une garantie forte).
 */
type Hit = { count: number; resetAt: number }

const buckets = new Map<string, Hit>()

// Limites par fenêtre de 60 s
const LIMITS: { test: (path: string) => boolean; max: number }[] = [
  { test: (p) => p.startsWith('/api/checkout'), max: 10 },
  { test: (p) => p.startsWith('/api/donation-finalize'), max: 20 },
  { test: (p) => p.startsWith('/api/donation-session'), max: 60 },
  { test: (p) => p.startsWith('/api/'), max: 60 },
]

const WINDOW_MS = 60_000

// Nettoyage périodique des entrées expirées (évite la fuite mémoire)
let lastSweep = 0
const sweep = (now: number) => {
  if (now - lastSweep < WINDOW_MS) return
  lastSweep = now
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key)
  }
}

export default defineEventHandler((event) => {
  const path = event.path || ''
  if (!path.startsWith('/api/')) return

  const rule = LIMITS.find((l) => l.test(path))
  if (!rule) return

  const now = Date.now()
  sweep(now)

  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestHeader(event, 'x-real-ip') ||
    event.node.req.socket?.remoteAddress ||
    'unknown'

  const key = `${ip}:${rule.max}:${path.split('?')[0]}`
  const hit = buckets.get(key)

  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  hit.count += 1
  if (hit.count > rule.max) {
    const retry = Math.ceil((hit.resetAt - now) / 1000)
    setResponseHeader(event, 'Retry-After', retry)
    throw createError({
      statusCode: 429,
      statusMessage: 'Trop de requêtes. Veuillez réessayer dans un instant.',
    })
  }
})
