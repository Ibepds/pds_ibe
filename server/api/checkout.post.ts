const MIN_CENTS = 100 //   1 €
const MAX_CENTS = 1_000_000 // 10 000 €

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; amount?: number; coverFees?: boolean }>(event)
  const email = body?.email?.trim()

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })
  }

  const amountCents = Math.round(Number(body?.amount) * 100)
  if (!Number.isFinite(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    throw createError({ statusCode: 400, statusMessage: 'Montant du don invalide (entre 1 € et 10 000 €).' })
  }

  // Frais recalculés côté serveur (le client ne fait foi sur rien)
  const feeCents = body?.coverFees ? coverFeeCents(amountCents) : 0
  const totalCents = amountCents + feeCents

  const stripe = getStripe()
  const origin = getRequestURL(event).origin

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: totalCents,
          product_data: {
            name: feeCents > 0 ? 'Don + frais couverts — PDS Humanity' : 'Don — PDS Humanity',
          },
        },
      },
    ],
    metadata: {
      donationCents: String(amountCents),
      feeCents: String(feeCents),
    },
    success_url: `${origin}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/donate`,
  })

  return { url: session.url }
})
