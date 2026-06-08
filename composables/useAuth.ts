import {
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

  const login = async (email: string, password: string) => {
    error.value = null
    if (!auth || !db) {
      error.value = 'Firebase non configuré. Vérifiez vos variables d\'environnement.'
      return false
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)

      // Vérification déterministe du statut admin avant toute navigation.
      const adminDoc = await getDoc(doc(db, 'admins', cred.user.uid))
      if (!adminDoc.exists()) {
        await signOut(auth)
        isAdmin.value = false
        error.value =
          "Ce compte n'a pas les droits administrateur. Contactez un administrateur."
        return false
      }

      isAdmin.value = true
      return true
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? ''
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        error.value = 'Email ou mot de passe incorrect.'
      } else if (code === 'auth/invalid-email') {
        error.value = 'Adresse e-mail invalide.'
      } else if (code === 'auth/too-many-requests') {
        error.value = 'Trop de tentatives. Réessayez plus tard.'
      } else {
        error.value = e instanceof Error ? e.message : 'Erreur de connexion'
      }
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
