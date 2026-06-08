<script setup lang="ts">
const year = new Date().getFullYear()
const { reset } = useCookieConsent()
</script>

<template>
  <footer class="border-t border-white/10 bg-surface-elevated">
    <div class="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="font-display text-xl font-bold gradient-text">PDS Humanity</h3>
          <p class="mt-2 text-sm text-gray-400">
            Marathon caritatif de 24h organisé par PDS Records / Ibé — musique, solidarité et engagement.
          </p>
          <p class="mt-4 text-xs text-gray-500">27 juin (18h) — 28 juin (18h)</p>
        </div>
        <div>
          <h4 class="font-semibold text-white">Navigation</h4>
          <ul class="mt-3 space-y-2 text-sm text-gray-400">
            <li><NuxtLink to="/presentation" class="hover:text-primary-light">Présentation</NuxtLink></li>
            <li><NuxtLink to="/planning" class="hover:text-primary-light">Programme</NuxtLink></li>
            <li><NuxtLink to="/associations" class="hover:text-primary-light">Associations soutenues</NuxtLink></li>
            <li><NuxtLink to="/encheres" class="hover:text-primary-light">Enchères solidaires</NuxtLink></li>
            <li><NuxtLink to="/freestyles" class="hover:text-primary-light">Réservation freestyles</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-primary-light">FAQ</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-primary-light">Contact</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white">Organisateur</h4>
          <p class="mt-3 text-sm text-gray-400">
            Organisé par <strong class="text-primary-light">PDS Records / Ibé</strong>
          </p>
          <PrimaryButton to="/donate" class="mt-4 w-full">
            Faire un don
          </PrimaryButton>
          <p class="mt-4 text-xs text-gray-500">
            © {{ year }} PDS Humanity. Tous droits réservés.
          </p>
          <ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <li><NuxtLink to="/mentions-legales" class="hover:text-primary-light">Mentions légales</NuxtLink></li>
            <li><NuxtLink to="/confidentialite" class="hover:text-primary-light">Confidentialité</NuxtLink></li>
            <li><button type="button" class="hover:text-primary-light" @click="reset">Gérer les cookies</button></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
