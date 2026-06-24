<script setup lang="ts">
import { animateValue, formatCurrency } from '~/utils/format'

definePageMeta({ layout: false })

const route = useRoute()
const isPreview = computed(() => route.query.preview !== undefined)

useHead(() => ({
  title: isPreview.value ? 'Aperçu overlay cagnotte — PDS Humanity' : 'Overlay cagnotte — PDS Humanity',
  meta: [{ name: 'robots', content: 'noindex' }],
  style: isPreview.value
    ? []
    : [{ innerHTML: 'html,body{background:transparent !important;margin:0}' }],
}))

const { total } = useDonationsLive()

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
  <div class="page" :class="{ 'page--preview': isPreview }">
    <div v-if="isPreview" class="preview-bar">
      <p class="preview-label">Aperçu overlay OBS</p>
      <p class="preview-hint">
        Montant seul, fond transparent. URL OBS :
        <code class="preview-code">/overlay/cagnotte</code>
      </p>
    </div>

    <div class="jar-root">
      <p class="jar-amount">{{ formatCurrency(display) }}</p>
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
  padding: 0.75rem 1rem 1rem;
  text-align: center;
  font-family: system-ui, sans-serif;
  pointer-events: none;
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

.page--preview .jar-root {
  padding-top: calc(4vh + 4.5rem);
}

.jar-amount {
  margin: 0;
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 700;
  line-height: 1;
  color: #fff;
  letter-spacing: 0.02em;
}
</style>
