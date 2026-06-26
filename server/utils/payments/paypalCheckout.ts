import { createPayPalOrder } from '../paypal'
import { eurosFromCents } from '../checkoutShared'
import type { CheckoutResult } from '../checkoutShared'

export async function createPayPalCheckoutSession(params: {
  donationCents: number
  feeCents: number
  totalCents: number
  email: string
  origin: string
}): Promise<CheckoutResult> {
  const { approvalUrl } = await createPayPalOrder({
    totalEuros: eurosFromCents(params.totalCents),
    donationCents: params.donationCents,
    feeCents: params.feeCents,
    email: params.email,
    returnUrl: `${params.origin}/don/merci`,
    cancelUrl: `${params.origin}/donate`,
  })

  return { url: approvalUrl, provider: 'paypal' }
}
