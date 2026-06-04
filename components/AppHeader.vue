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
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-surface/90 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-cyan font-display text-sm font-bold"
        >
          PDS
        </div>
        <div>
          <span class="font-display text-lg font-bold">PDS Humanity</span>
          <p class="text-xs text-gray-400">Événement caritatif</p>
        </div>
      </NuxtLink>

      <nav class="hidden items-center gap-5 xl:flex">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium transition hover:text-primary-light"
          :class="isActive(link.to) ? 'text-primary-light' : 'text-gray-300'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <PrimaryButton to="/donate" class="hidden sm:inline-flex">
          Faire un don
        </PrimaryButton>
        <button
          class="rounded-lg p-2 text-gray-300 hover:bg-white/5 xl:hidden"
          aria-label="Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="mobileOpen"
      class="border-t border-white/5 bg-surface-elevated px-4 py-4 xl:hidden"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="block py-2 text-gray-200"
        @click="mobileOpen = false"
      >
        {{ link.label }}
      </NuxtLink>
      <PrimaryButton to="/donate" class="mt-3 w-full" @click="mobileOpen = false">
        Faire un don
      </PrimaryButton>
    </div>
  </header>
</template>
