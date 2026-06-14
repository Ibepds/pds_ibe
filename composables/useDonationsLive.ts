import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import type { Donation } from '~/types'
import { MOCK_DONATIONS } from '~/utils/mockData'

/**
 * Abonnement temps réel à la collection `donations`.
 * Le total récolté est calculé en sommant TOUS les dons (source de vérité),
 * plutôt que de dépendre d'un compteur stocké susceptible de dériver.
 */
export function useDonationsLive() {
  const { db, ready } = useFirebase()
  const donations = ref<Donation[]>([])
  const loading = ref(true)
  let unsub: (() => void) | null = null

  onMounted(() => {
    if (!ready || !db) {
      donations.value = [...MOCK_DONATIONS]
      loading.value = false
      return
    }
    const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'))
    unsub = onSnapshot(
      q,
      (snap) => {
        donations.value = snap.empty
          ? []
          : (snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Donation[])
        loading.value = false
      },
      () => {
        donations.value = [...MOCK_DONATIONS]
        loading.value = false
      },
    )
  })

  onUnmounted(() => unsub?.())

  const total = computed(() =>
    donations.value.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
  )
  const count = computed(() => donations.value.length)

  return { donations, total, count, loading }
}
