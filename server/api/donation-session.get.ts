import { getPaymentProvider } from '../utils/paymentProvider'
import {
  getPayPalOrder,
  isPayPalOrderPaid,
  parsePayPalCustomId,
} from '../utils/paypal'

async function getStripeSessionInfo(sessionId: string) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const paid = session.payment_status === 'paid'

  let recorded = false
  try {
    const db = getAdminDb()
    const existing = await db
      .collection('donations')
      .where('sessionId', '==', session.id)
      .limit(1)
      .get()
    recorded = !existing.empty
  } catch {
    recorded = false
  }

  const donationCents = Number(session.metadata?.donationCents)
  const amount =
    Number.isFinite(donationCents) && donationCents > 0
      ? donationCents / 100
      : (session.amount_total ?? 0) / 100

  return { paid, amount, recorded, provider: 'stripe' as const }
}

async function getPayPalSessionInfo(orderId: string) {
  const order = await getPayPalOrder(orderId)
  const paid = isPayPalOrderPaid(order)

  let recorded = false
  try {
    const db = getAdminDb()
    const existing = await db
      .collection('donations')
      .where('sessionId', '==', orderId)
      .limit(1)
      .get()
    recorded = !existing.empty
  } catch {
    recorded = false
  }

  const meta = parsePayPalCustomId(order.purchase_units?.[0]?.custom_id)
  const donationCents = Number(meta.donationCents)
  const captureAmount = order.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
  const unitAmount = order.purchase_units?.[0]?.amount?.value
  const amount =
    Number.isFinite(donationCents) && donationCents > 0
      ? donationCents / 100
      : Number(captureAmount || unitAmount || 0)

  return { paid, amount, recorded, provider: 'paypal' as const }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sessionId = typeof query.session_id === 'string' ? query.session_id : ''
  const token = typeof query.token === 'string' ? query.token : ''

  if (sessionId) {
    return getStripeSessionInfo(sessionId)
  }

  if (token) {
    return getPayPalSessionInfo(token)
  }

  const provider = getPaymentProvider()
  throw createError({
    statusCode: 400,
    statusMessage:
      provider === 'paypal'
        ? 'token PayPal manquant.'
        : 'session_id manquant.',
  })
})
