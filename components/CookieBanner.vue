<script setup lang="ts">
const { consent, ready, init, accept, refuse } = useCookieConsent()

onMounted(init)

// Affiché tant que l'utilisateur n'a pas fait de choix
const visible = computed(() => ready.value && consent.value === null)
</script>

<template>
  <transition name="cookie-fade">
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-surface-elevated/95 backdrop-blur-md"
      role="dialog"
      aria-label="Gestion des cookies"
    >
      <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
        <p class="text-sm text-gray-300">
          🍪 Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre accord,
          des outils de mesure d'audience. En savoir plus dans notre
          <NuxtLink to="/confidentialite" class="text-primary-light hover:underline">politique de confidentialité</NuxtLink>.
        </p>
        <div class="flex flex-shrink-0 gap-3">
          <button
            class="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/5"
            @click="refuse"
          >
            Refuser
          </button>
          <button
            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            @click="accept"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
