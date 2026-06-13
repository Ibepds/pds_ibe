<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/presentation', label: 'Présentation' },
  { to: '/planning', label: 'Programme' },
  { to: '/associations', label: 'Associations' },
  { to: '/encheres', label: 'Enchères' },
  { to: '/freestyles', label: 'Freestyles' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-transparent">
    <div class="mx-auto flex max-w-lg items-center justify-between px-5 py-5 md:max-w-2xl">
      <!-- Hamburger (maquette) -->
      <button
        class="p-1 text-white"
        aria-label="Menu"
        :aria-expanded="mobileOpen"
        @click="mobileOpen = !mobileOpen"
      >
        <svg class="h-6 w-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 32 24">
          <path stroke-linecap="round" d="M2 5h28M2 12h28M2 19h28" />
        </svg>
      </button>

      <!-- Tickets (maquette) -->
      <NuxtLink to="/freestyles" class="btn-ticket">
        Tickets
        <ChalkHeart class="!h-3 !w-3" />
      </NuxtLink>
    </div>

    <Transition name="menu-slide">
      <div
        v-if="mobileOpen"
        class="border-t border-white/20 bg-primary/98 px-5 py-5 backdrop-blur-md"
      >
        <nav class="space-y-2">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="block py-2 font-display text-sm uppercase tracking-wide"
            :class="isActive(link.to) ? 'text-primary-light' : 'text-white/85'"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
