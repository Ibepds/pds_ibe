<script setup lang="ts">
import { formatCurrencyPrecise } from '~/utils/format'

export interface OverlayAlertData {
  id: string
  username: string
  amount: number
  message: string
}

const props = defineProps<{
  alert: OverlayAlertData
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

function restartVideo() {
  const el = videoRef.value
  if (!el) return
  el.currentTime = 0
  el.play().catch(() => {})
}

onMounted(() => restartVideo())

watch(() => props.alert.id, () => restartVideo())
</script>

<template>
  <div class="alert-card">
    <video
      ref="videoRef"
      class="alert-video"
      src="/videos/overlay-alerte.mov"
      autoplay
      muted
      playsinline
      loop
      preload="auto"
    />

    <div class="alert-text">
      <div class="alert-copy">
        <p class="alert-donation">
          <span class="alert-user">{{ alert.username }}</span>
          <span class="alert-verb">a donné</span>
          <span class="alert-amount">{{ formatCurrencyPrecise(alert.amount) }}</span>
        </p>

        <p v-if="alert.message" class="alert-message">
          <span class="alert-message-inner">{{ alert.message }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-card {
  position: relative;
  width: min(92vw, 34rem);
  line-height: 0;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.28));
}

.alert-video {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.15rem;
}

.alert-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40% 6% 0;
  pointer-events: none;
}

.alert-copy {
  width: 100%;
  max-width: 28rem;
  text-align: center;
  animation: copy-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.alert-donation {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.35rem 0.5rem;
  margin: 0;
  font-family: 'Cossette Titre', system-ui, sans-serif;
  line-height: 1.15;
}

.alert-user {
  font-size: clamp(1.35rem, 4.8vw, 2.1rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  text-shadow:
    0 0 18px rgba(5, 70, 160, 0.65),
    0 1px 2px rgba(0, 0, 0, 0.45);
}

.alert-verb {
  font-family: 'IM Fell DW Pica', Georgia, serif;
  font-size: clamp(1.1rem, 3.6vw, 1.5rem);
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.82);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.alert-amount {
  font-size: clamp(1.5rem, 5.2vw, 2.35rem);
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #fff;
  text-shadow:
    0 0 14px rgba(255, 255, 255, 0.35),
    0 1px 2px rgba(0, 0, 0, 0.45);
}

.alert-message {
  margin: 0.65rem 0 0;
  animation: copy-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
}

.alert-message-inner {
  max-width: 100%;
  padding: 0 0.15rem;
  font-family: 'IM Fell DW Pica', Georgia, serif;
  font-size: clamp(1rem, 3.2vw, 1.35rem);
  font-style: italic;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.88);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

@keyframes copy-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
