<script setup lang="ts">
import { formatDate } from '~/utils/format'

const year = new Date().getFullYear()
const { reset } = useCookieConsent()
const { event } = useEvent()

// Liens plateformes réutilisés depuis la config Événement (admin)
const platforms = computed(() =>
  [
    { label: 'Twitch', url: event.value?.liveUrl },
    { label: 'YouTube', url: event.value?.youtubeUrl },
    { label: 'TikTok', url: event.value?.tiktokUrl },
    { label: 'eBay Live', url: event.value?.ebayLiveUrl },
  ].filter((p) => p.url),
)
</script>

<template>
  <footer class="section-divider border-t border-white/20 py-14 text-white">
    <div class="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div class="grid gap-10 md:grid-cols-3">
        <div>
          <img
            :src="event?.logoUrl || '/images/logo-white.png'"
            :alt="event?.name ?? 'PDS Humanity'"
            height="40"
            width="160"
            loading="lazy"
            decoding="async"
            class="h-12 w-auto max-w-[170px] object-contain"
          />
          <p class="mt-2 text-sm text-gray-400">
            {{ event?.tagline ?? 'Marathon caritatif de 24h — musique, solidarité et engagement.' }}
          </p>
          <p v-if="event?.startDate && event?.endDate" class="mt-4 text-xs text-gray-500">
            {{ formatDate(event.startDate) }} → {{ formatDate(event.endDate) }}
          </p>

          <div v-if="platforms.length" class="mt-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Suivez le live</p>
            <ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
              <li v-for="p in platforms" :key="p.label">
                <a :href="p.url" target="_blank" rel="noopener" class="hover:text-primary-light">{{ p.label }}</a>
              </li>
            </ul>
          </div>
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
            Organisé par
            <strong class="text-primary-light">{{ event?.organizerName ?? 'PDS Records / Ibé' }}</strong>
          </p>
          <PrimaryButton to="/donate" class="mt-4 w-full">
            Faire un don
          </PrimaryButton>
          <p class="mt-4 text-xs text-gray-500">
            © {{ year }} {{ event?.name ?? 'PDS Humanity' }}. Tous droits réservés.
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
