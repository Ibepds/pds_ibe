<script setup lang="ts">
// Pictogrammes PERSO (blanc / bleu / rouge) dispersés en arrière-plan avec
// parallax au scroll. Les positions sont RÉ-ALÉATOIRES à chaque changement de page.

interface Perso {
  src: string
  top: string
  left: string
  w: string
  rot: number
  op: number
}

// Sur fond clair : uniquement bleu / rouge (le blanc serait invisible)
const SRCS = ['/images/perso-bleu.png', '/images/perso-rouge.png']

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

const makePerso = (): Perso => ({
  src: pick(SRCS),
  top: `${rand(4, 86).toFixed(1)}%`,
  left: `${rand(-4, 80).toFixed(1)}%`,
  w: `${Math.round(rand(150, 280))}px`,
  rot: Math.round(rand(-12, 12)),
  op: Number(rand(0.05, 0.1).toFixed(2)),
})

const farPerso = ref<Perso[]>([])
const nearPerso = ref<Perso[]>([])

const regenerate = () => {
  farPerso.value = Array.from({ length: 2 }, makePerso)
  nearPerso.value = Array.from({ length: 2 }, makePerso)
}

// Parallax
const scrollY = ref(0)
const reduced = ref(false)
let raf = 0
const onScroll = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    scrollY.value = window.scrollY
  })
}

const route = useRoute()

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  regenerate()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})

// Nouvelle disposition aléatoire à chaque changement de page
watch(() => route.path, () => regenerate())

const farStyle = computed(() => ({
  transform: reduced.value ? 'none' : `translate3d(0, ${-scrollY.value * 0.18}px, 0)`,
}))
const nearStyle = computed(() => ({
  transform: reduced.value ? 'none' : `translate3d(0, ${-scrollY.value * 0.42}px, 0)`,
}))
</script>

<template>
  <ClientOnly>
    <div class="pointer-events-none fixed inset-0 -z-[8] overflow-hidden" aria-hidden="true">
      <div class="absolute inset-0" :style="farStyle">
        <img
          v-for="(p, i) in farPerso"
          :key="`f-${i}-${p.src}-${p.top}`"
          :src="p.src"
          alt=""
          loading="lazy"
          decoding="async"
          class="perso-fade absolute h-auto select-none"
          :style="{ top: p.top, left: p.left, width: p.w, opacity: p.op, transform: `rotate(${p.rot}deg)` }"
        />
      </div>
      <div class="absolute inset-0" :style="nearStyle">
        <img
          v-for="(p, i) in nearPerso"
          :key="`n-${i}-${p.src}-${p.top}`"
          :src="p.src"
          alt=""
          loading="lazy"
          decoding="async"
          class="perso-fade absolute h-auto select-none"
          :style="{ top: p.top, left: p.left, width: p.w, opacity: p.op, transform: `rotate(${p.rot}deg)` }"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.perso-fade {
  animation: persoIn 0.6s ease-out;
}
@keyframes persoIn {
  from {
    opacity: 0;
  }
}
</style>
