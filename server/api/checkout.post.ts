import { parseCheckoutBody } from '../utils/checkoutShared'
import { createStripeCheckoutSession } from '../utils/payments/stripeCheckout'
import { createPayPalCheckoutSession } from '../utils/payments/paypalCheckout'

const clean = (s: unknown, max: number) =>
  (typeof s === 'string' ? s : '').trim().slice(0, max)

const normalizeHandle = (s: string) => clean(s.replace(/^@+/, ''), 40)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { donationCents, feeCents, totalCents, email, provider } = parseCheckoutBody(body)
  const origin = getRequestURL(event).origin

  const params = { donationCents, feeCents, totalCents, email, origin }

  if (provider === 'stripe') {
    return createStripeCheckoutSession(params)
  }
  return createPayPalCheckoutSession(params)
})
