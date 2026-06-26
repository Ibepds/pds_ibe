/**
 * Checkout Stripe explicite — conservé pour basculer sans changer NUXT_PAYMENT_PROVIDER.
 * Même logique que l'ancien POST /api/checkout lorsque le provider est stripe.
 */
import { parseCheckoutBody } from '../utils/checkoutShared'
import { createStripeCheckoutSession } from '../utils/payments/stripeCheckout'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { donationCents, feeCents, totalCents, email } = parseCheckoutBody(body)
  const origin = getRequestURL(event).origin
  return createStripeCheckoutSession({ donationCents, feeCents, totalCents, email, origin })
})
