import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, type Auth, type User } from 'firebase/auth'
import { doc, getDoc, getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public

  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
  }

  const hasConfig = Boolean(
    firebaseConfig.apiKey && firebaseConfig.projectId,
  )

  let app: FirebaseApp | null = null
  let auth: Auth | null = null
  let db: Firestore | null = null
  let storage: FirebaseStorage | null = null

  // État d'authentification global (lu par useAuth)
  const user = useState<User | null>('auth-user', () => null)
  const isAdmin = useState<boolean>('auth-is-admin', () => false)
  const loading = useState<boolean>('auth-loading', () => true)

  if (hasConfig) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Initialisation du listener d'auth dès le démarrage de l'app.
    // C'est ce qui fait passer `loading` à false et débloque le middleware admin.
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser && db) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid))
          isAdmin.value = adminDoc.exists()
        } catch {
          isAdmin.value = false
        }
      } else {
        isAdmin.value = false
      }
      loading.value = false
    })
  } else {
    // Firebase non configuré : on débloque immédiatement.
    loading.value = false
  }

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth,
      firebaseDb: db,
      firebaseStorage: storage,
      firebaseReady: hasConfig,
    },
  }
})
