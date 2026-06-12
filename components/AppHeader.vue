<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)
const { event } = useEvent()

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

// Bascule vers la nav compacte une fois qu'on a scrollé
const scrolled = ref(false)
let raf = 0
const onScroll = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 90
  })
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div>
    <!-- ───── Nav complète (en haut de page) ───── -->
    <Transition name="nav-top">
      <header
        v-show="!scrolled"
        class="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md"
      >
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <NuxtLink to="/" class="flex items-center gap-3">
            <img
              v-if="event?.logoUrl"
              :src="event.logoUrl"
              :alt="event?.name ?? 'PDS Humanity'"
              height="40"
              width="160"
              decoding="async"
              fetchpriority="high"
              class="h-10 w-auto max-w-[160px] object-contain"
            />
            <template v-else>
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-display text-sm font-bold text-white"
              >
                PDS
              </div>
              <div>
                <span class="font-display text-lg font-bold uppercase tracking-wide text-ink">{{ event?.name ?? 'PDS Humanity' }}</span>
                <p class="accent-serif text-xs text-ink/50">Musique &amp; Solidarité</p>
              </div>
            </template>
          </NuxtLink>

          <nav class="hidden items-center gap-5 xl:flex">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="text-sm font-medium uppercase tracking-wide transition hover:text-primary"
              :class="isActive(link.to) ? 'text-primary' : 'text-ink/70'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-3">
            <PrimaryButton to="/donate" class="hidden sm:inline-flex">
              Faire un don
            </PrimaryButton>
            <button
              class="rounded-lg p-2 text-ink/70 hover:bg-ink/5 xl:hidden"
              aria-label="Menu"
              @click="mobileOpen = !mobileOpen"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div
          v-if="mobileOpen"
          class="border-t border-ink/10 bg-paper px-4 py-4 xl:hidden"
        >
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="block py-2 uppercase tracking-wide text-ink/80"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
          <PrimaryButton to="/donate" class="mt-3 w-full" @click="mobileOpen = false">
            Faire un don
          </PrimaryButton>
        </div>
      </header>
    </Transition>

    <!-- ───── Nav compacte (au scroll) : pilule flottante épurée ───── -->
    <Transition name="nav-pill">
      <nav
        v-show="scrolled"
        class="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-ink/95 px-2 py-2 text-white shadow-lg backdrop-blur-md"
      >
        <NuxtLink
          to="/"
          class="rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition hover:bg-white/10"
          :class="route.path === '/' ? 'text-white' : 'text-white/70'"
        >
          Accueil
        </NuxtLink>
        <NuxtLink
          to="/freestyles"
          class="rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition hover:bg-white/10"
          :class="route.path.startsWith('/freestyles') ? 'text-white' : 'text-white/70'"
        >
          Freestyles
        </NuxtLink>
        <NuxtLink
          to="/donate"
          class="rounded-full bg-white px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-white/80"
        >
          Faire un don
        </NuxtLink>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
/* Nav complète : glisse vers le haut en disparaissant */
.nav-top-enter-active,
.nav-top-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.nav-top-enter-from,
.nav-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Pilule compacte : apparaît depuis le haut avec un léger rebond */
.nav-pill-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-pill-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.nav-pill-enter-from,
.nav-pill-leave-to {
  opacity: 0;
  transform: translate(-50%, -120%);
}
</style>
