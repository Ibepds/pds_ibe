import { getStripe } from '../stripe'

export async function createStripeCheckoutSession(params: {
  donationCents: number
  feeCents: number
  totalCents: number
  email: string
  origin: string
}): Promise<{ url: string }> {
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: params.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: params.totalCents,
          product_data: {
            name:
              params.feeCents > 0
                ? 'Don + frais couverts — PDS Humanity'
                : 'Don — PDS Humanity',
          },
        },
      },
    ],
    metadata: {
      donationCents: String(params.donationCents),
      feeCents: String(params.feeCents),
    },
    success_url: `${params.origin}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/donate`,
  })

  if (!session.url) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de créer la session Stripe' })
  }

  return { url: session.url }
}
