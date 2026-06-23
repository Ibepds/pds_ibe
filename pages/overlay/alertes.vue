<script setup lang="ts">
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { formatCurrencyPrecise } from '~/utils/format'

// Page autonome (sans header/footer) pour source navigateur OBS
definePageMeta({ layout: false })

// Fond transparent pour l'overlay (OBS affiche la transparence)
useHead({
  title: 'Overlay alertes — PDS Humanity',
  meta: [{ name: 'robots', content: 'noindex' }],
  style: [{ innerHTML: 'html,body{background:transparent !important;margin:0}' }],
})

interface Alert {
  id: string
  username: string
  amount: number
  message: string
}

const { db, ready } = useFirebase()
const current = ref<Alert | null>(null)
const queue: Alert[] = []
const seen = new Set<string>()
let initialized = false
let unsub: (() => void) | null = null
let playing = false

const playNext = () => {
  if (playing) return
  const next = queue.shift()
  if (!next) return
  playing = true
  current.value = next
  // Affichage ~7,5 s puis transition
  setTimeout(() => {
    current.value = null
    setTimeout(() => {
      playing = false
      playNext()
    }, 600)
  }, 7500)
}

onMounted(() => {
  if (!ready || !db) return
  const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'), limit(10))
  unsub = onSnapshot(q, (snap) => {
    if (!initialized) {
      snap.docs.forEach((d) => seen.add(d.id))
      initialized = true
      return
    }
    snap.docChanges().forEach((change) => {
      if (change.type === 'added' && !seen.has(change.doc.id)) {
        seen.add(change.doc.id)
        const data = change.doc.data() as {
          username?: string
          amount?: number
          message?: string
          source?: string
        }
        // Les dons Twitch sont déjà annoncés par Twitch → on ne les rejoue pas ici
        if (data.source === 'twitch') return
        queue.push({
          id: change.doc.id,
          username: data.username || 'Anonyme',
          amount: data.amount ?? 0,
          message: data.message || '',
        })
        playNext()
      }
    })
  })
})

onUnmounted(() => unsub?.())
</script>

<template>
  <div class="alert-root">
    <Transition name="alert">
      <div v-if="current" :key="current.id" class="alert-card">
        <div class="alert-heart">💙</div>
        <p class="alert-title">Nouveau don !</p>
        <p class="alert-line">
          <span class="alert-user">{{ current.username }}</span>
          a donné
          <span class="alert-amount">{{ formatCurrencyPrecise(current.amount) }}</span>
        </p>
        <p v-if="current.message" class="alert-message">« {{ current.message }} »</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.alert-root {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8vh;
  font-family: 'Cossette Titre', system-ui, sans-serif;
  pointer-events: none;
}
.alert-card {
  text-align: center;
  color: #fff;
  background: rgba(5, 70, 160, 0.85);
  border: 4px solid #fff;
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  max-width: 90vw;
}
.alert-heart {
  font-size: 3.5rem;
  line-height: 1;
}
.alert-title {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.alert-line {
  margin-top: 0.75rem;
  font-size: 2rem;
}
.alert-user {
  color: #3e78d6;
  font-weight: 700;
}
.alert-amount {
  color: #4ade80;
  font-weight: 700;
}
.alert-message {
  margin-top: 0.75rem;
  font-size: 1.25rem;
  font-style: italic;
  opacity: 0.9;
}

/* Entrée/sortie animées */
.alert-enter-active {
  animation: pop-in 0.5s cubic-bezier(0.2, 1.2, 0.3, 1);
}
.alert-leave-active {
  animation: pop-out 0.5s ease forwards;
}
@keyframes pop-in {
  from {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes pop-out {
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}
</style>
