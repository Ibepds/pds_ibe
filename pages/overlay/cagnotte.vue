<script setup lang="ts">
import { animateValue, formatCurrency } from '~/utils/format'

// Page autonome (sans header/footer) pour source navigateur OBS
definePageMeta({ layout: false })

useHead({
  title: 'Overlay cagnotte — PDS Humanity',
  meta: [{ name: 'robots', content: 'noindex' }],
  style: [{ innerHTML: 'html,body{background:transparent !important;margin:0}' }],
})

const { total } = useDonationsLive()

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
      <p class="jar-amount">{{ formatCurrency(display) }}</p>
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
  display: inline-block;
  background: rgba(5, 70, 160, 0.9);
  border: 4px solid #fff;
  border-radius: 1rem;
  padding: 1.25rem 2.5rem 1.5rem;
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
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: #4ade80;
}
</style>
