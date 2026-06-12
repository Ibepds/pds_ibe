<script setup lang="ts">
import { doc, onSnapshot } from 'firebase/firestore'
import {
  MOCK_ASSOCIATIONS,
  MOCK_DONATIONS,
  MOCK_FAQ,
  MOCK_SCHEDULE,
} from '~/utils/mockData'

const { event, loading: eventLoading } = useEvent()

// Compteur de collecte en temps réel : on écoute le document event/main
// pour que le montant/donateurs se mettent à jour live à chaque don.
const { db, ready } = useFirebase()
let unsubEvent: (() => void) | null = null
onMounted(() => {
  if (!ready || !db) return
  unsubEvent = onSnapshot(doc(db, 'event', 'main'), (snap) => {
    if (!snap.exists()) return
    const d = snap.data()
    if (event.value) {
      event.value = {
        ...event.value,
        currentAmount: d.currentAmount ?? event.value.currentAmount,
        donorsCount: d.donorsCount ?? event.value.donorsCount,
        isLive: d.isLive ?? event.value.isLive,
      }
    } else {
      event.value = { id: 'main', ...d } as unknown as NonNullable<typeof event.value>
    }
  })
})
onUnmounted(() => unsubEvent?.())

const { data: schedule, loading: sLoading } = useFirestoreCollection(
  'schedule',
  MOCK_SCHEDULE,
  { orderField: 'order', orderDirection: 'asc' },
)

const { data: donations, loading: dLoading } = useFirestoreCollection(
  'donations',
  MOCK_DONATIONS,
  { orderField: 'createdAt', orderDirection: 'desc' },
)

const { data: faq, loading: fLoading } = useFirestoreCollection('faq', MOCK_FAQ, {
  orderField: 'order',
  orderDirection: 'asc',
})

const { data: associations, loading: aLoading } = useFirestoreCollection(
  'associations',
  MOCK_ASSOCIATIONS,
)

definePageMeta({ pageBackground: 'dark' })

usePageSeo({
  title: 'PDS Humanity — Musique & Solidarité',
  description:
    'Marathon caritatif de 24h organisé par PDS Records / Ibé les 27 et 28 juin. Dons en direct, freestyles nocturnes et enchères solidaires sur Twitch, YouTube, TikTok et eBay Live.',
  path: '/',
})
</script>

<template>
  <div>
    <HeroSection :event="event" :loading="eventLoading" />

    <BrandTicker :items="event?.tickerItems" />

    <section v-if="event" class="py-24 md:py-32">
      <div class="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <p class="accent-serif mb-8 text-xl text-white/80">L'événement commence dans</p>
        <EventCountdown :end-date="event.startDate" />
      </div>
    </section>

    <DonationCounter
      v-if="event"
      :current="event.currentAmount"
      :goal="event.donationGoal"
      :donors-count="event.donorsCount"
      :loading="eventLoading"
    />

    <LiveSection
      v-if="event"
      :is-live="event.isLive"
      :live-url="event.liveUrl"
    />

    <!-- Associations soutenues -->
    <section class="py-24 md:py-32 bg-surface-elevated/40">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title gradient-text">Associations soutenues</h2>
        <p class="accent-serif mt-4 text-xl text-white/80">L'ensemble des fonds reversés à ces organisations</p>
        <div v-if="aLoading" class="mt-12 grid gap-8 md:grid-cols-2">
          <div v-for="n in 2" :key="n" class="card-glow h-32 animate-pulse" />
        </div>
        <div v-else class="mt-12 grid gap-8 md:grid-cols-2">
          <div v-for="asso in associations" :key="asso.id ?? asso.name" class="card-glow p-8">
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green/30 to-primary/30 font-display text-xl font-bold"
              >
                {{ asso.name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-semibold text-white">{{ asso.name }}</h3>
                <p class="text-sm text-gray-400 line-clamp-2">{{ asso.mission }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-12 text-center">
          <PrimaryButton to="/associations" variant="outline">Découvrir les associations</PrimaryButton>
        </div>
      </div>
    </section>

    <!-- Programme -->
    <section class="py-24 md:py-32">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title gradient-text">Programme</h2>
        <p class="accent-serif mt-4 text-xl text-white/80">Les temps forts du marathon de 24h</p>
        <ScheduleTimeline :items="schedule" :loading="sLoading" :limit="4" />
        <div class="mt-12 text-center">
          <PrimaryButton to="/planning" variant="outline">Programme complet</PrimaryButton>
        </div>
      </div>
    </section>

    <BrandTicker :items="event?.tickerItems" variant="outline" />

    <!-- Freestyles CTA -->
    <section class="py-24 md:py-32 bg-surface-elevated/40">
      <div class="mx-auto max-w-7xl px-4 lg:px-8 text-center">
        <h2 class="section-title gradient-text">Freestyles nocturnes</h2>
        <p class="accent-serif mx-auto mt-4 max-w-2xl text-xl text-white/80">
          56 créneaux de 8 minutes ouverts au public dans la nuit du 27 au 28 juin (03h00 → 10h29).
          Réservez le vôtre dès maintenant.
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <PrimaryButton to="/freestyles">Réserver un créneau</PrimaryButton>
          <PrimaryButton to="/encheres" variant="outline">Voir les enchères</PrimaryButton>
        </div>
      </div>
    </section>

    <RecentDonations :donations="donations" :loading="dLoading" :limit="5" />
    <FaqSection :items="faq" :loading="fLoading" :limit="4" />
  </div>
</template>
