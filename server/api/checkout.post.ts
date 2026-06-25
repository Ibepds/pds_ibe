const MIN_CENTS = 100 //   1 €
const MAX_CENTS = 1_000_000 // 10 000 €

const clean = (s: unknown, max: number) =>
  (typeof s === 'string' ? s : '').trim().slice(0, max)

const normalizeHandle = (s: string) => clean(s.replace(/^@+/, ''), 40)

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email?: string
    amount?: number
    coverFees?: boolean
    raffleParticipate?: boolean
    rafflePhone?: string
    raffleInstagram?: string
    raffleTiktok?: string
  }>(event)
  const email = body?.email?.trim()

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })
  }

  const amountCents = Math.round(Number(body?.amount) * 100)
  if (!Number.isFinite(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    throw createError({ statusCode: 400, statusMessage: 'Montant du don invalide (entre 1 € et 10 000 €).' })
  }

  if (typeof body?.raffleParticipate !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Veuillez indiquer si vous souhaitez participer au tirage au sort.',
    })
  }

  const raffleParticipate = body.raffleParticipate
  let rafflePhone = ''
  let raffleInstagram = ''
  let raffleTiktok = ''

  if (raffleParticipate) {
    rafflePhone = clean(body?.rafflePhone, 20)
    raffleInstagram = normalizeHandle(body?.raffleInstagram ?? '')
    raffleTiktok = normalizeHandle(body?.raffleTiktok ?? '')
    if (!rafflePhone || rafflePhone.replace(/\D/g, '').length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'Numéro de téléphone invalide pour le tirage au sort.' })
    }
    if (!raffleInstagram) {
      throw createError({ statusCode: 400, statusMessage: 'Pseudo Instagram requis pour le tirage au sort.' })
    }
    if (!raffleTiktok) {
      throw createError({ statusCode: 400, statusMessage: 'Pseudo TikTok requis pour le tirage au sort.' })
    }
  }

  // Frais recalculés côté serveur (le client ne fait foi sur rien)
  const feeCents = body?.coverFees ? coverFeeCents(amountCents) : 0
  const totalCents = amountCents + feeCents

  const stripe = getStripe()
  const origin = getRequestURL(event).origin

  const metadata: Record<string, string> = {
    donationCents: String(amountCents),
    feeCents: String(feeCents),
    raffleParticipate: raffleParticipate ? 'yes' : 'no',
  }
  if (raffleParticipate) {
    metadata.rafflePhone = rafflePhone
    metadata.raffleInstagram = raffleInstagram
    metadata.raffleTiktok = raffleTiktok
  }

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
    metadata,
    success_url: `${origin}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/donate`,
  })

  return { url: session.url }
})
