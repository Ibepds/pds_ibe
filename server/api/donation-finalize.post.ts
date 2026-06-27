import { cleanDonorFields, recordDonation } from '../utils/recordDonation'

const clean = (s: unknown, max: number) =>
  (typeof s === 'string' ? s : '').trim().slice(0, max)

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    session_id?: string
    username?: string
    message?: string
    anonymous?: boolean
  }>(event)

  const sessionId = body?.session_id
  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'session_id manquant.' })
  }

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') {
    throw createError({ statusCode: 402, statusMessage: 'Paiement non confirmé.' })
  }

  const donationCents = Number(session.metadata?.donationCents)
  const amount =
    Number.isFinite(donationCents) && donationCents > 0
      ? donationCents / 100
      : (session.amount_total ?? 0) / 100
  const { username, message } = cleanDonorFields(body)
  const email =
    clean(session.customer_details?.email ?? session.customer_email, 320) || undefined

  try {
    return await recordDonation({
      sessionId: session.id,
      amount,
      username,
      message,
      email,
    })
  } catch (e) {
    if ((e as { statusCode?: number }).statusCode) throw e
    console.error('[donation-finalize] échec écriture Firestore:', e)
    throw createError({
      statusCode: 500,
      statusMessage: `Enregistrement du don impossible : ${(e as Error).message}`,
    })
  }
})
