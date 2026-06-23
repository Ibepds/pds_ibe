<script setup lang="ts">
import { MOCK_EVENT } from '~/utils/mockData'
import { animateValue, formatCurrency, getProgressPercent } from '~/utils/format'

// Page autonome (sans header/footer) pour source navigateur OBS
definePageMeta({ layout: false })

useHead({
  title: 'Overlay cagnotte — PDS Humanity',
  meta: [{ name: 'robots', content: 'noindex' }],
  style: [{ innerHTML: 'html,body{background:transparent !important;margin:0}' }],
})

const { event } = useEvent()
const { total, count } = useDonationsLive()

const goal = computed(() => event.value?.donationGoal ?? MOCK_EVENT.donationGoal)
const progress = computed(() => getProgressPercent(total.value, goal.value))

// Compteur animé qui suit le total en temps réel
const display = ref(0)
watch(
  total,
  (val) => {
    if (import.meta.client) {
      animateValue(display.value, val, 1000, (v) => (display.value = v))
    } else {
      display.value = val
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="jar-root">
    <div class="jar-card">
      <p class="jar-label">💙 Cagnotte PDS Humanity</p>
      <p class="jar-amount">
        {{ formatCurrency(display) }}
        <span class="jar-goal">/ {{ formatCurrency(goal) }}</span>
      </p>
      <div class="jar-bar">
        <div class="jar-fill" :style="{ width: `${progress}%` }" />
      </div>
      <p class="jar-meta">{{ progress }}% de l'objectif · {{ count }} don{{ count > 1 ? 's' : '' }}</p>
    </div>
  </div>
</template>

<style scoped>
.jar-root {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4vh;
  font-family: 'Cossette Titre', system-ui, sans-serif;
  pointer-events: none;
}
.jar-card {
  width: min(92vw, 760px);
  background: rgba(5, 70, 160, 0.9);
  border: 4px solid #fff;
  border-radius: 1rem;
  padding: 1.5rem 2.5rem 2rem;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
  color: #fff;
  text-align: center;
}
.jar-label {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.9;
}
.jar-amount {
  margin-top: 0.5rem;
  font-size: 3.75rem;
  font-weight: 700;
  line-height: 1;
}
.jar-goal {
  color: rgba(255, 255, 255, 0.5);
  font-size: 2.25rem;
}
.jar-bar {
  margin-top: 1.25rem;
  height: 1.5rem;
  border: 3px solid #fff;
  padding: 3px;
}
.jar-fill {
  height: 100%;
  background: #4ade80;
  transition: width 1s ease-out;
}
.jar-meta {
  margin-top: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ec3ff;
}
</style>
