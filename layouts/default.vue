<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <!-- Pictogrammes PERSO discrets (parallax léger) -->
    <PersoLayer />
    <AppHeader />
    <main class="pt-20">
      <slot />
    </main>
    <AppFooter />
    <CookieBanner />
    <DonationToast />
  </div>
</template>
