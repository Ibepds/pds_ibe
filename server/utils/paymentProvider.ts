export type PaymentProvider = 'paypal' | 'stripe'

export function getPaymentProvider(): PaymentProvider {
  const p = String(useRuntimeConfig().paymentProvider || 'paypal').toLowerCase()
  return p === 'stripe' ? 'stripe' : 'paypal'
}

/** Provider choisi sur le formulaire, sinon défaut .env */
export function resolveCheckoutProvider(override?: unknown): PaymentProvider {
  const p = String(override || getPaymentProvider()).toLowerCase()
  return p === 'stripe' ? 'stripe' : 'paypal'
}
