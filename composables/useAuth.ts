import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export function useAuth() {
  const { auth, db, ready } = useFirebase()
  const user = useState<User | null>('auth-user', () => null)
  const isAdmin = useState<boolean>('auth-is-admin', () => false)
  const loading = useState<boolean>('auth-loading', () => true)
  const error = useState<string | null>('auth-error', () => null)

  const initAuth = () => {
    if (!ready || !auth) {
      loading.value = false
      return () => {}
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
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
  }

  if (import.meta.client && ready) {
    onMounted(() => {
      const unsub = initAuth()
      onUnmounted(() => unsub?.())
    })
  } else if (!ready) {
    loading.value = false
  }

  const login = async (email: string, password: string) => {
    error.value = null
    if (!auth) {
      error.value = 'Firebase non configuré. Vérifiez vos variables d\'environnement.'
      return false
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (e: unknown) {
      error.value =
        e instanceof Error ? e.message : 'Erreur de connexion'
      return false
    }
  }

  const logout = async () => {
    if (!auth) return
    await signOut(auth)
    isAdmin.value = false
  }

  return {
    user,
    isAdmin,
    loading,
    error,
    login,
    logout,
    ready,
  }
}
