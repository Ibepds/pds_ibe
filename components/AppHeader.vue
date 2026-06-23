<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)
const inscriptionOpen = ref(false)

const openInscription = () => {
  mobileOpen.value = false
  inscriptionOpen.value = true
}

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

const isHome = computed(() => route.path === '/')

// Logo header : visible une fois la 1re section (hero) dépassée sur l'accueil ;
// toujours visible sur les autres pages (pas de grand logo hero).
const scrolledPastHero = ref(false)
const showLogo = computed(() => !isHome.value || scrolledPastHero.value)

const onScroll = () => {
  scrolledPastHero.value = window.scrollY > window.innerHeight * 0.7
}

onMounted(() => {
  if (!import.meta.client) return
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

watch(() => route.path, () => {
  mobileOpen.value = false
  if (import.meta.client) onScroll()
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

        <!-- Logo cliquable (ramène à l'accueil) — apparaît une fois la 1re section dépassée -->
        <Transition name="logo-fade">
          <NuxtLink
            v-show="showLogo"
            to="/"
            aria-label="Retour à l'accueil"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition hover:opacity-80"
          >
            <img
              src="/images/logo-white.png"
              alt="PDS Humanity"
              width="120"
              height="60"
              decoding="async"
              class="h-7 w-auto object-contain sm:h-9 md:h-10"
            />
          </NuxtLink>
        </Transition>

        <button
          type="button"
          class="ml-auto inline-flex shrink-0 items-center gap-2 border-2 border-white px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wide text-white transition hover:bg-white/10 sm:px-4 sm:text-xs"
          @click="openInscription"
        >
          S'inscrire
        </button>

        <ChalkButton
          preset="donate"
          to="/donate"
          class="header-donate-btn !ml-2 !mr-0 shrink-0 !w-auto !max-w-[8rem] sm:!max-w-[10rem] md:!max-w-[160px]"
        />
      </div>

      <Transition name="menu-slide">
        <div
          v-if="mobileOpen"
          class="border-t border-white/20 bg-primary-dark/95 py-5 shadow-lg backdrop-blur-md"
        >
          <nav class="home-container space-y-2">
            <button
              type="button"
              class="mb-2 flex w-full items-center justify-center border-2 border-white py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
              @click="openInscription"
            >
              S'inscrire
            </button>
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

    <InscriptionModal :open="inscriptionOpen" @close="inscriptionOpen = false" />
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

.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
}

/* Navbar : « Faire un don » collé à droite de « S'inscrire » (le groupe est poussé
   à droite par le ml-auto du bouton S'inscrire). Override du centrage global .chalk-btn. */
.header-donate-btn {
  margin-left: 0.5rem !important;
  margin-right: 0 !important;
  max-width: min(9.5rem, calc(100vw - 5rem)) !important;
}
</style>
