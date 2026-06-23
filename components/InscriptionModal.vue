<script setup lang="ts">
import { DA } from '~/utils/daAssets'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { battles } = useBattles()

// Bloque le scroll du fond quand la modale est ouverte
watch(
  () => props.open,
  (open) => {
    if (!import.meta.client) return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)
onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

const go = () => emit('close')
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Inscription"
    >
      <!-- Fond -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="emit('close')" />

      <!-- Carte -->
      <div class="relative z-10 w-full max-w-3xl border-2 border-white bg-primary p-6 shadow-2xl md:p-10">
        <button
          class="absolute right-4 top-4 text-white/70 transition hover:text-white"
          aria-label="Fermer"
          @click="emit('close')"
        >
          <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 class="text-center font-display text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
          Je m'inscris
        </h2>
        <p class="mt-2 text-center text-sm text-white/70">Choisis comment tu veux participer au live.</p>

        <div class="mt-8 grid gap-5 md:grid-cols-2">
          <!-- Artiste / Freestyle -->
          <NuxtLink
            to="/freestyles"
            class="flex h-full flex-col items-center gap-4 border-2 border-white/40 bg-white/5 p-6 text-center transition hover:bg-white/10"
            @click="go"
          >
            <div class="relative">
              <ChalkImage :src="DA.cgpt.user" class="chalk-picto h-14 w-14 md:h-16 md:w-16" />
              <ChalkImage :src="DA.cgpt.star" class="chalk-picto absolute -right-2 -top-1 h-6 w-6 opacity-90" />
            </div>
            <img
              :src="DA.retours.titreArtiste"
              alt="Tu es artiste ?"
              loading="lazy"
              class="mx-auto h-auto w-full max-w-[12rem] object-contain"
            />
            <p class="text-sm text-white/70">Réserve ton créneau de freestyle nocturne.</p>
            <span class="mt-auto inline-flex items-center gap-2 border-2 border-primary-light px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-primary-light">
              <ChalkImage :src="DA.cgpt.microphone" class="chalk-inline h-5 w-5 shrink-0" />
              Réserver un freestyle
            </span>
          </NuxtLink>

          <!-- Battles (spectateur) -->
          <NuxtLink
            to="/battles"
            class="flex h-full flex-col items-center gap-4 border-2 border-white/40 bg-white/5 p-6 text-center transition hover:bg-white/10"
            @click="go"
          >
            <div class="relative">
              <ChalkImage :src="DA.cgpt.musicNote" class="chalk-picto h-14 w-14 md:h-16 md:w-16" />
              <ChalkImage :src="DA.cgpt.star" class="chalk-picto absolute -right-2 -top-1 h-6 w-6 opacity-90" />
            </div>
            <p class="font-display text-xl font-bold uppercase tracking-wide text-primary-light md:text-2xl">
              {{ battles.ctaTitle }}
            </p>
            <p class="text-sm text-white/70">{{ battles.ctaText }}</p>
            <span class="mt-auto inline-flex items-center gap-2 border-2 border-primary-light px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-primary-light">
              <ChalkImage :src="DA.cgpt.musicNote" class="chalk-inline h-5 w-5 shrink-0" />
              {{ battles.ctaButton }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
