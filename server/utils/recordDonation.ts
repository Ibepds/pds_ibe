import { FieldValue } from 'firebase-admin/firestore'

const clean = (s: unknown, max: number) =>
  (typeof s === 'string' ? s : '').trim().slice(0, max)

export interface RecordDonationParams {
  sessionId: string
  amount: number
  username: string
  message: string
  email?: string
}

export async function recordDonation(params: RecordDonationParams): Promise<{
  ok: true
  duplicate?: boolean
  amount: number
  username: string
  message: string
}> {
  const { sessionId, amount, username, message, email } = params

  const db = getAdminDb()

  const existing = await db
    .collection('donations')
    .where('sessionId', '==', sessionId)
    .limit(1)
    .get()
  if (!existing.empty) {
    return { ok: true, duplicate: true, amount, username, message }
  }

  await db.collection('donations').add({
    username,
    amount,
    message,
    sessionId,
    createdAt: new Date().toISOString(),
    serverCreatedAt: FieldValue.serverTimestamp(),
  })

  if (email) {
    await db.collection('donationContacts').add({
      email,
      username,
      amount,
      sessionId,
      createdAt: new Date().toISOString(),
      serverCreatedAt: FieldValue.serverTimestamp(),
    })
  }

  await db.collection('event').doc('main').set(
    {
      currentAmount: FieldValue.increment(amount),
      donorsCount: FieldValue.increment(1),
    },
    { merge: true },
  )

  return { ok: true, amount, username, message }
}

export function cleanDonorFields(body: {
  username?: string
  message?: string
  anonymous?: boolean
}): { username: string; message: string } {
  const username = body?.anonymous ? 'Anonyme' : clean(body?.username, 40) || 'Anonyme'
  const message = body?.anonymous ? '' : clean(body?.message, 300)
  return { username, message }
}
