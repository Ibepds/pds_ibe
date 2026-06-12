<script setup lang="ts">
type BgVariant = 'blue' | 'dark' | 'white' | 'cyan'

const route = useRoute()

// Mapping variante -> image + voile(s). Les fonds clairs (cyan, blanc) reçoivent
// un voile bleu + sombre pour garantir la lisibilité du texte blanc.
// (Classes en dur ici pour être détectées par Tailwind.)
const BG: Record<BgVariant, { img: string; overlays: string[] }> = {
  blue: { img: 'bg-pds-texture', overlays: ['bg-black/30'] },
  dark: { img: 'bg-pds-texture', overlays: ['bg-black/25'] },
  cyan: { img: 'bg-pds-cyan', overlays: ['bg-primary/55', 'bg-black/35'] },
  white: { img: 'bg-pds-white', overlays: ['bg-primary/45', 'bg-black/50'] },
}

// Variante définie par page via definePageMeta({ pageBackground }) -> route.meta
// (cohérent serveur/client, pas de mismatch d'hydratation).
const variant = computed<BgVariant>(() => (route.meta.pageBackground as BgVariant) ?? 'dark')
const bg = computed(() => BG[variant.value] ?? BG.dark)

// Petit logo PDS Humanity en haut de page (variante "dark")
const showLogo = computed(() => variant.value === 'dark')
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
    <!-- Petit logo PDS Humanity en haut de page -->
    <img
      v-if="showLogo"
      src="/images/logo-white.png"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute left-1/2 top-24 -z-[3] w-40 -translate-x-1/2 opacity-90 md:w-52"
    />
    <!-- Pictogrammes PERSO (blanc/bleu/rouge) en parallax, derrière les graffitis -->
    <PersoLayer />
    <!-- Graffitis avec parallax (dérivent au scroll, fond fixe) -->
    <GraffitiLayer />
    <AppHeader />
    <main class="pt-20">
      <slot />
    </main>
    <AppFooter />
    <CookieBanner />
    <DonationToast />
  </div>
</template>
