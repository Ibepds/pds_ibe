<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/10 bg-surface-elevated">
    <div class="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="font-display text-xl font-bold gradient-text">Ibé PDS</h3>
          <p class="mt-2 text-sm text-gray-400">
            Événement caritatif organisé par Ibé PDS — streamers, artistes et invités unis pour une cause solidaire.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-white">Navigation</h4>
          <ul class="mt-3 space-y-2 text-sm text-gray-400">
            <li><NuxtLink to="/participants" class="hover:text-primary-light">Participants</NuxtLink></li>
            <li><NuxtLink to="/planning" class="hover:text-primary-light">Planning</NuxtLink></li>
            <li><NuxtLink to="/association" class="hover:text-primary-light">Association</NuxtLink></li>
            <li><NuxtLink to="/donate" class="hover:text-primary-light">Faire un don</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-primary-light">FAQ</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white">Organisateur</h4>
          <p class="mt-3 text-sm text-gray-400">
            Organisé par <strong class="text-primary-light">Ibé PDS</strong>
          </p>
          <p class="mt-2 text-xs text-gray-500">
            © {{ year }} Ibé PDS. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
