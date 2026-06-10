<script setup lang="ts">
import type { BgVariant } from '~/composables/usePageBackground'

const pageBg = useState<BgVariant>('page-bg', () => 'dark')

// Mapping variante -> image + voile(s). Les fonds clairs (cyan, blanc) reçoivent
// un voile bleu + sombre pour garantir la lisibilité du texte blanc.
// (Classes en dur ici pour être détectées par Tailwind.)
const BG: Record<BgVariant, { img: string; overlays: string[] }> = {
  blue: { img: 'bg-pds-texture', overlays: ['bg-black/30'] },
  dark: { img: 'bg-pds-dark', overlays: ['bg-black/25'] },
  cyan: { img: 'bg-pds-cyan', overlays: ['bg-primary/55', 'bg-black/35'] },
  white: { img: 'bg-pds-white', overlays: ['bg-primary/45', 'bg-black/50'] },
}
const bg = computed(() => BG[pageBg.value] ?? BG.dark)
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Fond texturé PDS Humanity (varie selon la page) -->
    <div class="pointer-events-none fixed inset-0 -z-10 bg-black" aria-hidden="true" />
    <div
      class="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
      :class="bg.img"
      aria-hidden="true"
    />
    <div
      v-for="(o, i) in bg.overlays"
      :key="i"
      class="pointer-events-none fixed inset-0 -z-10"
      :class="o"
      aria-hidden="true"
    />
    <!-- Graffitis avec parallax (dérivent au scroll, fond fixe) -->
    <GraffitiLayer />
    <AppHeader />
    <main class="pt-20">
      <slot />
    </main>
    <AppFooter />
    <CookieBanner />
  </div>
</template>
