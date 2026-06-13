<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="page-chalk">
    <AppHeader />
    <main :class="route.path === '/' ? '' : 'pt-20'">
      <slot />
    </main>
    <AppFooter />
    <CookieBanner />
    <DonationToast />
  </div>
</template>
