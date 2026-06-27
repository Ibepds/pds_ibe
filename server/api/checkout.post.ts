import { parseCheckoutBody } from '../utils/checkoutShared'
import { createStripeCheckoutSession } from '../utils/payments/stripeCheckout'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { donationCents, feeCents, totalCents, email } = parseCheckoutBody(body)
  const origin = getRequestURL(event).origin
  return createStripeCheckoutSession({ donationCents, feeCents, totalCents, email, origin })
})
