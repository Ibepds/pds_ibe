/**
 * Gestion du consentement aux cookies (RGPD).
 * Stocke le choix dans localStorage. Les outils de mesure d'audience optionnels
 * doivent vérifier `accepted.value` avant de se charger.
 */
const STORAGE_KEY = 'pds-cookie-consent'

export function useCookieConsent() {
  // 'accepted' | 'refused' | null (pas encore choisi)
  const consent = useState<'accepted' | 'refused' | null>('cookie-consent', () => null)
  const ready = useState<boolean>('cookie-consent-ready', () => false)

  const init = () => {
    if (!import.meta.client) return
    const stored = localStorage.getItem(STORAGE_KEY)
    consent.value = stored === 'accepted' || stored === 'refused' ? stored : null
    ready.value = true
  }

  const accept = () => {
    consent.value = 'accepted'
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, 'accepted')
  }

  const refuse = () => {
    consent.value = 'refused'
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, 'refused')
  }

  const reset = () => {
    consent.value = null
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
  }

  const accepted = computed(() => consent.value === 'accepted')

  return { consent, accepted, ready, init, accept, refuse, reset }
}
