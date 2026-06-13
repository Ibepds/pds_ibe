/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 * (Pas de CSP stricte ici pour ne pas casser les iframes Stripe / Twitch /
 * YouTube ni Firebase ; le clickjacking est couvert par X-Frame-Options.)
 */
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), browsing-topics=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  })

  // HSTS uniquement en HTTPS (production)
  const proto =
    getRequestHeader(event, 'x-forwarded-proto') ||
    (getRequestURL(event).protocol === 'https:' ? 'https' : 'http')
  if (proto === 'https') {
    setResponseHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
})
