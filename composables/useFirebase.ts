import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

export function useFirebase() {
  const nuxtApp = useNuxtApp()

  return {
    app: nuxtApp.$firebaseApp as FirebaseApp | null,
    auth: nuxtApp.$firebaseAuth as Auth | null,
    db: nuxtApp.$firebaseDb as Firestore | null,
    storage: nuxtApp.$firebaseStorage as FirebaseStorage | null,
    ready: nuxtApp.$firebaseReady as boolean,
  }
}
