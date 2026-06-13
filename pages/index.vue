<script setup lang="ts">
import { doc, onSnapshot } from 'firebase/firestore'
import {
  MOCK_ASSOCIATIONS,
  MOCK_DONATIONS,
  MOCK_ENCHERES,
  MOCK_SCHEDULE,
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

const { data: associations, loading: aLoading } = useFirestoreCollection(
  'associations',
  MOCK_ASSOCIATIONS,
)

const { single: encheres, loading: eLoading } = useFirestoreCollection(
  'content',
  [{ id: 'encheres', ...MOCK_ENCHERES }],
  { docId: 'encheres' },
)

usePageSeo({
  title: 'PDS Humanity — Musique & Solidarité',
  description:
    'Marathon caritatif de 24h organisé par PDS Records / Ibé les 27 et 28 juin. Dons en direct, freestyles nocturnes et enchères solidaires.',
  path: '/',
})
</script>

<template>
  <div class="home-scroll">
    <HomeScrollPanel>
      <HeroSection :event="event" :loading="eventLoading" large />
    </HomeScrollPanel>

    <HomeScrollPanel v-if="event" id="countdown">
      <HomeCountdownSection
        :end-date="event.startDate"
        :live-url="event.liveUrl"
        :loading="eventLoading"
        large
      />
    </HomeScrollPanel>

    <HomeScrollPanel v-if="event">
      <HomeProgrammeSection
        :items="schedule"
        :loading="sLoading"
        :limit="5"
        embedded
        large
      />
    </HomeScrollPanel>

    <HomeScrollPanel v-if="event">
      <HomeDonationBar
        :current="event.currentAmount"
        :goal="event.donationGoal"
        :loading="eventLoading"
        large
      />
    </HomeScrollPanel>

    <HomeScrollPanel>
      <HomeEncheresSection :lots="encheres?.lots" :loading="eLoading" large />
    </HomeScrollPanel>

    <HomeScrollPanel>
      <AssociationHomeCards :associations="associations" :loading="aLoading" large />
    </HomeScrollPanel>

    <HomeScrollPanel>
      <RecentDonations :donations="donations" :loading="dLoading" :limit="5" large />
    </HomeScrollPanel>

    <HomeScrollPanel>
      <HomeThankYouSection />
    </HomeScrollPanel>
  </div>
</template>
