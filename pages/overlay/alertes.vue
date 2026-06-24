<script setup lang="ts">
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import type { OverlayAlertData } from '~/components/overlay/OverlayDonationAlert.vue'

// Page autonome (sans header/footer) pour source navigateur OBS
definePageMeta({ layout: false })

const route = useRoute()
const isPreview = computed(() => route.query.preview !== undefined)

const PREVIEW_SAMPLES: OverlayAlertData[] = [
  {
    id: 'preview-1',
    username: 'Camille42',
    amount: 50,
    message: 'Bravo pour cette belle initiative !',
  },
  {
    id: 'preview-2',
    username: 'Anonyme',
    amount: 25,
    message: '',
  },
  {
    id: 'preview-3',
    username: 'StreamFan',
    amount: 120.5,
    message: 'On est avec vous pour les 24h',
  },
]

useHead(() => ({
  title: isPreview.value ? 'Aperçu overlay alertes — PDS Humanity' : 'Overlay alertes — PDS Humanity',
  meta: [{ name: 'robots', content: 'noindex' }],
  style: isPreview.value
    ? []
    : [{ innerHTML: 'html,body{background:transparent !important;margin:0}' }],
}))

const { db, ready } = useFirebase()
const current = ref<OverlayAlertData | null>(null)
const queue: OverlayAlertData[] = []
const seen = new Set<string>()
let initialized = false
let unsub: (() => void) | null = null
let playing = false
let previewIndex = 0

const playNext = () => {
  if (playing) return
  const next = queue.shift()
  if (!next) return
  playing = true
  current.value = next
  setTimeout(() => {
    current.value = null
    setTimeout(() => {
      playing = false
      playNext()
    }, 600)
  }, 7500)
}

const triggerPreview = () => {
  const sample = PREVIEW_SAMPLES[previewIndex % PREVIEW_SAMPLES.length]
  previewIndex += 1
  queue.push({ ...sample, id: `${sample.id}-${Date.now()}` })
  playNext()
}

onMounted(() => {
  if (isPreview.value) {
    triggerPreview()
    return
  }

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
  <div class="page" :class="{ 'page--preview': isPreview }">
  <div v-if="isPreview" class="preview-bar">
    <div class="preview-bar-inner">
      <p class="preview-label">Aperçu overlay OBS</p>
      <p class="preview-hint">
        Fond damier = transparence. URL OBS :
        <code class="preview-code">/overlay/alertes</code>
        (sans <code class="preview-code">?preview</code>)
      </p>
      <button type="button" class="preview-btn" @click="triggerPreview">
        Relancer une alerte
      </button>
    </div>
  </div>

  <div class="alert-root">
    <Transition name="alert">
      <OverlayDonationAlert v-if="current" :key="current.id" :alert="current" />
    </Transition>
  </div>
  </div>
</template>

<style scoped>
.page--preview {
  min-height: 100dvh;
  background-color: #0546a0;
  background-image:
    linear-gradient(45deg, rgba(255, 255, 255, 0.06) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.06) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.06) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.06) 75%);
  background-size: 24px 24px;
  background-position:
    0 0,
    0 12px,
    12px -12px,
    -12px 0;
}

.preview-bar {
  position: fixed;
  inset: 0 auto auto 0;
  z-index: 20;
  width: 100%;
  border-bottom: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(5, 70, 160, 0.95);
  backdrop-filter: blur(8px);
  pointer-events: auto;
}

.preview-bar-inner {
  margin: 0 auto;
  max-width: 48rem;
  padding: 0.75rem 1rem 1rem;
  text-align: center;
  font-family: system-ui, sans-serif;
}

.preview-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.preview-hint {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.preview-code {
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.1rem 0.35rem;
  font-size: 0.75rem;
}

.preview-btn {
  margin-top: 0.65rem;
  border: 2px solid #fff;
  background: transparent;
  padding: 0.45rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.preview-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

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

.page--preview .alert-root {
  padding-top: calc(8vh + 5.5rem);
}

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
