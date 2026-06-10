<script setup lang="ts">
// Couche décorative de graffitis avec parallax au scroll.
// Le fond bleu (dans le layout) reste fixe ; cette couche dérive plus lentement
// que le contenu → effet de profondeur / parallax.

const scrollY = ref(0)
const reduced = ref(false)
let raf = 0

const onScroll = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    scrollY.value = window.scrollY
  })
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})

const farStyle = computed(() => ({
  transform: reduced.value ? 'none' : `translate3d(0, ${-scrollY.value * 0.12}px, 0)`,
}))
const nearStyle = computed(() => ({
  transform: reduced.value ? 'none' : `translate3d(0, ${-scrollY.value * 0.32}px, 0)`,
}))

// Tags lointains (lents) et proches (rapides)
const farTags = [
  { t: 'PDS', top: '6%', left: '3%', rot: -10, cls: 'text-[110px] md:text-[170px]', hollow: true, blue: false },
  { t: 'HUMANITY', top: '64%', left: '55%', rot: 7, cls: 'text-[70px] md:text-[120px]', hollow: true, blue: false },
  { t: '24H', top: '38%', left: '78%', rot: -6, cls: 'text-[80px] md:text-[130px]', hollow: false, blue: true },
  { t: '★', top: '20%', left: '88%', rot: 0, cls: 'text-[60px] md:text-[90px]', hollow: false, blue: true },
]
const nearTags = [
  { t: 'IBÉ', top: '78%', left: '8%', rot: 8, cls: 'text-[90px] md:text-[150px]', hollow: false, blue: false },
  { t: 'LIVE', top: '14%', left: '40%', rot: -5, cls: 'text-[64px] md:text-[110px]', hollow: true, blue: true },
  { t: '♥', top: '48%', left: '18%', rot: -12, cls: 'text-[70px] md:text-[110px]', hollow: false, blue: true },
  { t: 'GROS DONS', top: '90%', left: '52%', rot: 6, cls: 'text-[44px] md:text-[80px]', hollow: true, blue: false },
]
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-[5] overflow-hidden" aria-hidden="true">
    <!-- Filtre SVG « spray / rough » pour des bords irréguliers de graffiti -->
    <svg class="absolute h-0 w-0">
      <filter id="graffiti-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" />
      </filter>
    </svg>

    <!-- Couche lointaine (parallax lent) -->
    <div class="absolute inset-0" :style="farStyle">
      <span
        v-for="(g, i) in farTags"
        :key="`f-${i}`"
        class="graffiti absolute font-display font-bold uppercase leading-none tracking-tight"
        :class="[g.cls, g.hollow ? 'graffiti--hollow' : 'graffiti--fill', g.blue && 'graffiti--blue']"
        :style="{ top: g.top, left: g.left, transform: `rotate(${g.rot}deg)` }"
      >{{ g.t }}</span>
    </div>

    <!-- Couche proche (parallax rapide) -->
    <div class="absolute inset-0" :style="nearStyle">
      <span
        v-for="(g, i) in nearTags"
        :key="`n-${i}`"
        class="graffiti absolute font-display font-bold uppercase leading-none tracking-tight"
        :class="[g.cls, g.hollow ? 'graffiti--hollow' : 'graffiti--fill', g.blue && 'graffiti--blue']"
        :style="{ top: g.top, left: g.left, transform: `rotate(${g.rot}deg)` }"
      >{{ g.t }}</span>
    </div>
  </div>
</template>

<style scoped>
.graffiti {
  filter: url(#graffiti-rough);
  will-change: transform;
}
/* Lettres creuses (contour blanc, façon throw-up) */
.graffiti--hollow {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.11);
}
/* Lettres pleines très discrètes */
.graffiti--fill {
  color: rgba(255, 255, 255, 0.06);
}
/* Accents bleu PDS Humanity */
.graffiti--blue.graffiti--hollow {
  -webkit-text-stroke-color: rgba(91, 155, 232, 0.2);
}
.graffiti--blue.graffiti--fill {
  color: rgba(91, 155, 232, 0.14);
}
</style>
