import { createHmac, timingSafeEqual } from 'node:crypto'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Webhook Twitch EventSub — reçoit les Cheers (Bits) et les ajoute aux dons du site.
 * Sécurité : vérification HMAC de la signature Twitch + idempotence par message-id.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secret = config.twitchEventsubSecret
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'Twitch EventSub non configuré.' })
  }

  const raw = (await readRawBody(event, 'utf8')) || ''
  const msgId = getRequestHeader(event, 'twitch-eventsub-message-id') || ''
  const timestamp = getRequestHeader(event, 'twitch-eventsub-message-timestamp') || ''
  const signature = getRequestHeader(event, 'twitch-eventsub-message-signature') || ''
  const msgType = getRequestHeader(event, 'twitch-eventsub-message-type') || ''

  // Vérification de la signature (HMAC-SHA256 sur id + timestamp + body)
  const expected =
    'sha256=' + createHmac('sha256', secret).update(msgId + timestamp + raw).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw createError({ statusCode: 403, statusMessage: 'Signature invalide.' })
  }

  const body = raw ? JSON.parse(raw) : {}

  // 1) Vérification d'abonnement : on renvoie le challenge en texte brut
  if (msgType === 'webhook_callback_verification') {
    setResponseHeader(event, 'Content-Type', 'text/plain')
    return body.challenge
  }

  // 2) Révocation : on accuse réception
  if (msgType === 'revocation') {
    console.warn('[twitch] abonnement révoqué:', body.subscription?.type, body.subscription?.status)
    return ''
  }

  // 3) Notification
  if (msgType === 'notification' && body.subscription?.type === 'channel.cheer') {
    const e = body.event ?? {}
    const bits = Number(e.bits) || 0
    if (bits <= 0) return ''

    const rate = parseFloat(config.bitsToEur || '0.01') || 0.01
    const amount = Math.round(bits * rate * 100) / 100
    const username = e.is_anonymous ? 'Anonyme' : (e.user_name || 'Anonyme')
    const message = typeof e.message === 'string' ? e.message.slice(0, 300) : ''

    try {
      const db = getAdminDb()
      // Idempotence : un seul don par message Twitch
      const existing = await db
        .collection('donations')
        .where('twitchMsgId', '==', msgId)
        .limit(1)
        .get()
      if (!existing.empty) return ''

      await db.collection('donations').add({
        username,
        amount,
        message,
        source: 'twitch',
        twitchMsgId: msgId,
        createdAt: new Date().toISOString(),
        serverCreatedAt: FieldValue.serverTimestamp(),
      })
    } catch (err) {
      console.error('[twitch] écriture don échouée:', err)
      // On renvoie 200 quand même : Twitch ne doit pas spammer de retries
    }
    return ''
  }

  return ''
})
