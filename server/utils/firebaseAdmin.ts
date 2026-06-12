import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
  type ServiceAccount,
} from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let _db: Firestore | null = null

export function getAdminDb(): Firestore {
  if (_db) return _db

  if (!getApps().length) {
    const raw = useRuntimeConfig().firebaseServiceAccount

    if (raw) {
      // Accepte le JSON brut OU encodé en base64 (recommandé : évite tout souci
      // de guillemets/échappement dans le fichier .env).
      let jsonStr = (typeof raw === 'string' ? raw : JSON.stringify(raw)).trim()
      if (!jsonStr.startsWith('{')) {
        try {
          jsonStr = Buffer.from(jsonStr, 'base64').toString('utf8')
        } catch {
          /* on tentera JSON.parse tel quel ci-dessous */
        }
      }

      let sa: ServiceAccount
      try {
        sa = JSON.parse(jsonStr)
      } catch {
        throw createError({
          statusCode: 400,
          statusMessage:
            'NUXT_FIREBASE_SERVICE_ACCOUNT invalide. Astuce : encodez le fichier .json en base64 et collez le résultat (sans guillemets).',
        })
      }

      try {
        initializeApp({ credential: cert(sa) })
      } catch (e) {
        throw createError({
          statusCode: 400,
          statusMessage: `Init Firebase Admin échouée : ${(e as Error).message}`,
        })
      }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Alternative : chemin vers le fichier de clé (GOOGLE_APPLICATION_CREDENTIALS)
      initializeApp({ credential: applicationDefault() })
    } else {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Firebase Admin non configuré : ajoutez NUXT_FIREBASE_SERVICE_ACCOUNT (base64 du fichier de clé) dans .env puis redémarrez.',
      })
    }
  }

  _db = getFirestore()
  return _db
}
