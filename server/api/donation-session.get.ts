export default defineEventHandler(async (event) => {
  const { session_id } = getQuery(event)
  if (!session_id || typeof session_id !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'session_id manquant.' })
  }

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(session_id)
  const paid = session.payment_status === 'paid'

  // Le don a-t-il déjà été enregistré ? (tolérant si Firebase Admin indisponible)
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

  return {
    paid,
    amount: (session.amount_total ?? 0) / 100,
    recorded,
  }
})
