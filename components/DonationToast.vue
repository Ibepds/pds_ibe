<script setup lang="ts">
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { formatCurrency } from '~/utils/format'

interface Toast {
  id: string
  username: string
  amount: number
  message: string
}

const { db, ready } = useFirebase()
const toasts = ref<Toast[]>([])
const seen = new Set<string>()
let initialized = false
let unsub: (() => void) | null = null

const pushToast = (t: Toast) => {
  toasts.value.push(t)
  setTimeout(() => {
    toasts.value = toasts.value.filter((x) => x.id !== t.id)
  }, 7000)
}

onMounted(() => {
  if (!ready || !db) return
  const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(8))
  unsub = onSnapshot(
    q,
    (snap) => {
      if (!initialized) {
        // Premier chargement : on mémorise sans notifier
        snap.docs.forEach((d) => seen.add(d.id))
        initialized = true
        return
      }
      snap.docChanges().forEach((change) => {
        if (change.type === 'added' && !seen.has(change.doc.id)) {
          seen.add(change.doc.id)
          const data = change.doc.data() as { username?: string; amount?: number; message?: string }
          pushToast({
            id: change.doc.id,
            username: data.username || 'Anonyme',
            amount: data.amount ?? 0,
            message: data.message || '',
          })
        }
      })
    },
    () => {},
  )
})

onUnmounted(() => unsub?.())
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-24 z-[70] flex w-[min(92vw,360px)] flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto overflow-hidden rounded-xl border border-white/25 bg-white/10 p-4 text-white shadow-xl backdrop-blur-lg"
      >
        <div class="flex items-center gap-2">
          <span class="text-xl">💙</span>
          <p class="font-display text-sm font-bold uppercase tracking-wide">Nouveau don !</p>
        </div>
        <p class="mt-1 text-sm">
          <strong class="text-primary-light">{{ t.username }}</strong>
          a fait un don de
          <strong class="text-accent-green">{{ formatCurrency(t.amount) }}</strong>
        </p>
        <p v-if="t.message" class="accent-serif mt-1 text-sm text-white/80">« {{ t.message }} »</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
