<script setup lang="ts">
import { doc, onSnapshot } from 'firebase/firestore'
import {
  MOCK_ASSOCIATIONS,
  MOCK_DONATIONS,
  MOCK_FAQ,
} from '~/utils/mockData'

const { event, loading: eventLoading } = useEvent()

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

usePageSeo({
  title: 'PDS Humanity — Musique & Solidarité',
  description:
    'Marathon caritatif de 24h organisé par PDS Records / Ibé les 27 et 28 juin. Dons en direct, freestyles nocturnes et enchères solidaires.',
  path: '/',
})
</script>

<template>
  <div class="home-container">
    <HeroSection :event="event" :loading="eventLoading" />

    <!-- Compte à rebours (maquette) -->
    <section v-if="event" class="section-divider py-12 md:py-16">
      <div v-reveal class="w-full">
        <h2 class="section-heading !justify-start">
          <ChalkHeart />
          L'événement commence dans
        </h2>
        <div class="section-split mt-8">
          <EventCountdown :end-date="event.startDate" />
          <div class="section-art">
            <ChalkDove />
          </div>
        </div>
      </div>
    </section>

    <DonationCounter
      v-if="event"
      :current="event.currentAmount"
      :goal="event.donationGoal"
      :loading="eventLoading"
    />

    <RecentDonations :donations="donations" :loading="dLoading" :limit="5" />

    <AssociationHomeCards :associations="associations" :loading="aLoading" />

    <FaqSection :items="faq" :loading="fLoading" teaser />
  </div>
</template>
