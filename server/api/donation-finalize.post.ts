import { FieldValue } from 'firebase-admin/firestore'

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

  // Vérification du paiement côté serveur (impossible de falsifier un don)
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') {
    throw createError({ statusCode: 402, statusMessage: 'Paiement non confirmé.' })
  }

  // Montant du don (hors frais couverts) : metadata si présent, sinon total payé
  const donationCents = Number(session.metadata?.donationCents)
  const amount = Number.isFinite(donationCents) && donationCents > 0
    ? donationCents / 100
    : (session.amount_total ?? 0) / 100
  const username = body?.anonymous ? 'Anonyme' : clean(body?.username, 40) || 'Anonyme'
  const message = body?.anonymous ? '' : clean(body?.message, 300)
  const email =
    clean(session.customer_details?.email ?? session.customer_email, 320) || undefined

  try {
    const db = getAdminDb()

    // Idempotence : un seul don par session Stripe
    const existing = await db
      .collection('donations')
      .where('sessionId', '==', session.id)
      .limit(1)
      .get()
    if (!existing.empty) {
      return { ok: true, duplicate: true }
    }

    // Don public : AUCUNE donnée personnelle (lecture publique du feed)
    await db.collection('donations').add({
      username,
      amount,
      message,
      sessionId: session.id,
      createdAt: new Date().toISOString(),
      serverCreatedAt: FieldValue.serverTimestamp(),
    })

    // Coordonnées du donateur : collection privée, lisible par les admins seulement
    if (email) {
      await db.collection('donationContacts').add({
        email,
        username,
        amount,
        sessionId: session.id,
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
    // Erreurs createError (config) : on les relaie telles quelles
    if ((e as { statusCode?: number }).statusCode) throw e
    console.error('[donation-finalize] échec écriture Firestore:', e)
    throw createError({
      statusCode: 500,
      statusMessage: `Enregistrement du don impossible : ${(e as Error).message}`,
    })
  }
})
