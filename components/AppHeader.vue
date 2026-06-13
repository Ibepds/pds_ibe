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

watch(mobileOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-transparent">
    <Transition name="overlay-fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        @click="mobileOpen = false"
      />
    </Transition>

    <div class="relative z-50">
      <div class="home-container flex items-center gap-4 py-5">
        <button
          class="shrink-0 p-1 text-white"
          aria-label="Menu"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="h-6 w-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 32 24">
            <path stroke-linecap="round" d="M2 5h28M2 12h28M2 19h28" />
          </svg>
        </button>

        <ChalkButton
          preset="donate"
          to="/donate"
          class="header-donate-btn shrink-0 !ml-auto !mr-0 !w-auto !max-w-[9.5rem] sm:!max-w-[10rem] md:!max-w-[160px]"
        />
      </div>

      <Transition name="menu-slide">
        <div
          v-if="mobileOpen"
          class="border-t border-white/20 bg-primary-dark/95 py-5 shadow-lg backdrop-blur-md"
        >
          <nav class="home-container space-y-2">
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
    </div>
  </header>
</template>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Navbar : « Faire un don » toujours à droite (override centrage global .chalk-btn) */
.header-donate-btn {
  margin-left: auto !important;
  margin-right: 0 !important;
}
</style>
