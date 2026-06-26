import { parseCheckoutBody } from '../utils/checkoutShared'
import { createStripeCheckoutSession } from '../utils/payments/stripeCheckout'
import { createPayPalCheckoutSession } from '../utils/payments/paypalCheckout'

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
