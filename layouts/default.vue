<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <!-- Pictogrammes PERSO discrets (parallax léger) -->
    <PersoLayer v-if="route.path !== '/'" />
    <AppHeader />
    <main :class="route.path === '/' ? '' : 'pt-20'">
      <slot />
    </main>
    <AppFooter />
    <CookieBanner />
    <DonationToast />
  </div>
</template>
