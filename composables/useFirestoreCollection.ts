import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type DocumentData,
} from 'firebase/firestore'

export function useFirestoreCollection<T extends { id: string }>(
  collectionName: string,
  mockData: T[],
  options?: {
    orderField?: string
    orderDirection?: 'asc' | 'desc'
    docId?: string
  },
) {
  const { db, ready } = useFirebase()
  const data = ref<T[]>([]) as Ref<T[]>
  const single = ref<T | null>(null) as Ref<T | null>
  const loading = ref(true)
  const error = ref<string | null>(null)
  const usingMock = ref(false)

  const fetch = async () => {
    loading.value = true
    error.value = null
    usingMock.value = false

    if (!ready || !db) {
      if (options?.docId) {
        single.value = mockData.find((d) => d.id === options.docId) ?? (mockData[0] as T) ?? null
      } else {
        data.value = [...mockData]
      }
      usingMock.value = true
      loading.value = false
      return
    }

    try {
      if (options?.docId) {
        const snap = await getDoc(doc(db, collectionName, options.docId))
        if (snap.exists()) {
          single.value = { id: snap.id, ...snap.data() } as T
        } else {
          single.value = mockData.find((d) => d.id === options.docId) ?? (mockData[0] as T) ?? null
          usingMock.value = true
        }
      } else {
        let q = query(collection(db, collectionName))
        if (options?.orderField) {
          q = query(
            collection(db, collectionName),
            orderBy(options.orderField, options.orderDirection ?? 'asc'),
          )
        }
        const snap = await getDocs(q)
        if (snap.empty) {
          data.value = [...mockData]
          usingMock.value = true
        } else {
          data.value = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as T[]
        }
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de chargement'
      if (options?.docId) {
        single.value = mockData.find((d) => d.id === options.docId) ?? (mockData[0] as T) ?? null
      } else {
        data.value = [...mockData]
      }
      usingMock.value = true
    } finally {
      loading.value = false
    }
  }

  onMounted(fetch)

  return { data, single, loading, error, usingMock, refresh: fetch }
}
