import { cleanDonorFields, recordDonation } from '../utils/recordDonation'
import {
  capturePayPalOrder,
  getPayPalOrder,
  isPayPalOrderPaid,
  parsePayPalCustomId,
} from '../utils/paypal'

const clean = (s: unknown, max: number) =>
  (typeof s === 'string' ? s : '').trim().slice(0, max)

async function finalizeStripeDonation(
  sessionId: string,
  body: { username?: string; message?: string; anonymous?: boolean },
) {
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

  return recordDonation({
    sessionId: session.id,
    provider: 'stripe',
    amount,
    username,
    message,
    email,
  })
}

async function finalizePayPalDonation(
  orderId: string,
  body: { username?: string; message?: string; anonymous?: boolean },
) {
  let order = await getPayPalOrder(orderId)

  if (order.status === 'APPROVED') {
    order = await capturePayPalOrder(orderId)
  }

  if (!isPayPalOrderPaid(order) || order.status !== 'COMPLETED') {
    throw createError({ statusCode: 402, statusMessage: 'Paiement PayPal non confirmé.' })
  }

  const meta = parsePayPalCustomId(order.purchase_units?.[0]?.custom_id)
  const donationCents = Number(meta.donationCents)
  const captureAmount = order.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
  const unitAmount = order.purchase_units?.[0]?.amount?.value
  const amount =
    Number.isFinite(donationCents) && donationCents > 0
      ? donationCents / 100
      : Number(captureAmount || unitAmount || 0)

  const { username, message } = cleanDonorFields(body)
  const email =
    clean(meta.email ?? order.payer?.email_address, 320) || undefined

  return recordDonation({
    sessionId: orderId,
    provider: 'paypal',
    amount,
    username,
    message,
    email,
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    session_id?: string
    token?: string
    username?: string
    message?: string
    anonymous?: boolean
  }>(event)

  const sessionId = body?.session_id
  const token = body?.token

  try {
    if (sessionId) {
      return await finalizeStripeDonation(sessionId, body)
    }
    if (token) {
      return await finalizePayPalDonation(token, body)
    }
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifiant de paiement manquant (session_id ou token).',
    })

    // Coordonnées du donateur : collection privée, lisible par les admins seulement
    if (email) {
      await db.collection('donationContacts').add({
        email,
        username,
        amount,
        sessionId: session.id,
        raffleParticipate,
        ...(raffleParticipate
          ? {
              rafflePhone,
              raffleInstagram,
              raffleTiktok,
            }
          : {}),
        createdAt: new Date().toISOString(),
        serverCreatedAt: FieldValue.serverTimestamp(),
      })
    }

    // Met à jour le compteur de collecte (atomique) : montant + nombre de donateurs
    await db.collection('event').doc('main').set(
      {
        currentAmount: FieldValue.increment(amount),
        donorsCount: FieldValue.increment(1),
      },
      { merge: true },
    )

    return { ok: true, amount, username, message }
  } catch (e) {
    if ((e as { statusCode?: number }).statusCode) throw e
    console.error('[donation-finalize] échec écriture Firestore:', e)
    throw createError({
      statusCode: 500,
      statusMessage: `Enregistrement du don impossible : ${(e as Error).message}`,
    })
  }
})
