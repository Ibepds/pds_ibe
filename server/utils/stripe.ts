import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  const key = useRuntimeConfig().stripeSecretKey
  if (!key) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe non configuré (STRIPE_SECRET_KEY manquant)' })
  }
  if (!_stripe) {
    _stripe = new Stripe(key)
  }
  return _stripe
}

let _priceId: string | null = null
const DONATION_LOOKUP_KEY = 'pds_humanity_don'

/**
 * Retourne (et crée si besoin) un Price Stripe "montant libre" (pay-what-you-want)
 * pour les dons, réutilisé via lookup_key. Stripe demandera le montant au donateur.
 */
export async function getDonationPriceId(stripe: Stripe): Promise<string> {
  if (_priceId) return _priceId

  const existing = await stripe.prices.list({
    lookup_keys: [DONATION_LOOKUP_KEY],
    active: true,
    limit: 1,
  })
  if (existing.data[0]) {
    _priceId = existing.data[0].id
    return _priceId
  }

  const price = await stripe.prices.create({
    currency: 'eur',
    custom_unit_amount: { enabled: true, minimum: 100 },
    lookup_key: DONATION_LOOKUP_KEY,
    product_data: { name: 'Don — PDS Humanity' },
  })
  _priceId = price.id
  return _priceId
}
