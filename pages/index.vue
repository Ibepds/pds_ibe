<script setup lang="ts">
import {
  MOCK_ASSOCIATIONS,
  MOCK_DONATIONS,
  MOCK_FAQ,
  MOCK_SCHEDULE,
} from '~/utils/mockData'

const { event, loading: eventLoading } = useEvent()

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
</script>

<template>
  <div>
    <HeroSection :event="event" :loading="eventLoading" />

    <section v-if="event" class="pb-8">
      <div class="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <p class="mb-4 text-sm uppercase tracking-wider text-gray-400">
          L'événement commence dans
        </p>
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
    <section class="py-16 bg-surface-elevated/50">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title">Associations soutenues</h2>
        <p class="mt-2 text-gray-400">L'ensemble des fonds reversés à ces organisations</p>
        <div v-if="aLoading" class="mt-8 grid gap-6 md:grid-cols-2">
          <div v-for="n in 2" :key="n" class="card-glow h-32 animate-pulse" />
        </div>
        <div v-else class="mt-8 grid gap-6 md:grid-cols-2">
          <div v-for="asso in associations" :key="asso.id ?? asso.name" class="card-glow p-6">
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
        <div class="mt-6 text-center">
          <PrimaryButton to="/associations" variant="outline">Découvrir les associations</PrimaryButton>
        </div>
      </div>
    </section>

    <!-- Programme -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title">Programme</h2>
        <p class="mt-2 text-gray-400">Les temps forts du marathon de 24h</p>
        <ScheduleTimeline :items="schedule" :loading="sLoading" :limit="4" />
        <div class="mt-6 text-center">
          <PrimaryButton to="/planning" variant="outline">Programme complet</PrimaryButton>
        </div>
      </div>
    </section>

    <!-- Freestyles CTA -->
    <section class="py-16 bg-surface-elevated/50">
      <div class="mx-auto max-w-7xl px-4 lg:px-8 text-center">
        <h2 class="section-title">Freestyles nocturnes</h2>
        <p class="mt-2 max-w-2xl mx-auto text-gray-400">
          50 créneaux de 6 minutes ouverts au public dans la nuit du 27 au 28 juin (4h00 → 8h54).
          Réservez le vôtre dès maintenant.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <PrimaryButton to="/freestyles">Réserver un créneau</PrimaryButton>
          <PrimaryButton to="/encheres" variant="outline">Voir les enchères</PrimaryButton>
        </div>
      </div>
    </section>

    <RecentDonations :donations="donations" :loading="dLoading" :limit="5" />
    <FaqSection :items="faq" :loading="fLoading" :limit="4" />
  </div>
</template>
