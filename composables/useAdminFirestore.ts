import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export function useAdminFirestore() {
  const { db, storage, ready } = useFirebase()

  const ensureDb = () => {
    if (!ready || !db) {
      throw new Error('Firebase non configuré')
    }
    return db
  }

  const create = async (collectionName: string, payload: Record<string, unknown>) => {
    const database = ensureDb()
    const ref = await addDoc(collection(database, collectionName), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  }

  const update = async (
    collectionName: string,
    id: string,
    payload: Record<string, unknown>,
  ) => {
    const database = ensureDb()
    await updateDoc(doc(database, collectionName, id), {
      ...payload,
      updatedAt: serverTimestamp(),
    })
  }

  const set = async (
    collectionName: string,
    id: string,
    payload: Record<string, unknown>,
  ) => {
    const database = ensureDb()
    await setDoc(
      doc(database, collectionName, id),
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  }

  const remove = async (collectionName: string, id: string) => {
    const database = ensureDb()
    await deleteDoc(doc(database, collectionName, id))
  }

  const uploadImage = async (path: string, file: File) => {
    if (!ready || !storage) {
      throw new Error('Firebase Storage non configuré')
    }
    const ref = storageRef(storage, path)
    await uploadBytes(ref, file)
    return getDownloadURL(ref)
  }

  return { create, update, set, remove, uploadImage, ready }
}
