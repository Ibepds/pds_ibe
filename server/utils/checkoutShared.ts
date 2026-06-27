import { coverFeeCents } from './fees'

export interface CheckoutBody {
  amount: number
  email: string
  coverFees?: boolean
}

const MIN_CENTS = 100
const MAX_CENTS = 1_000_000

export function parseCheckoutBody(body: unknown): {
  donationCents: number
  feeCents: number
  totalCents: number
  email: string
} {
  const b = body as CheckoutBody
  const donationCents = Math.round(Number(b?.amount) * 100)
  if (!Number.isFinite(donationCents) || donationCents < MIN_CENTS || donationCents > MAX_CENTS) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Montant du don invalide (entre 1 € et 10 000 €).',
    })
  }
  const email = String(b?.email || '').trim().toLowerCase()
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })
  }
  const feeCents = b?.coverFees ? coverFeeCents(donationCents) : 0
  const totalCents = donationCents + feeCents
  return { donationCents, feeCents, totalCents, email }
}
