<script setup lang="ts">
import {
  MOCK_ASSOCIATION,
  MOCK_DONATIONS,
  MOCK_FAQ,
  MOCK_PARTICIPANTS,
  MOCK_SCHEDULE,
} from '~/utils/mockData'

const { event, loading: eventLoading } = useEvent()

const { data: participants, loading: pLoading } = useFirestoreCollection(
  'participants',
  MOCK_PARTICIPANTS,
)

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

const { single: association, loading: aLoading } = useFirestoreCollection(
  'association',
  [{ id: 'main', ...MOCK_ASSOCIATION }],
  { docId: 'main' },
)

const featured = computed(() =>
  participants.value.filter((p) => p.isFeatured),
)
</script>

<template>
  <div>
    <HeroSection :event="event" :loading="eventLoading" />

    <section v-if="event" class="pb-8">
      <div class="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <p class="mb-4 text-sm uppercase tracking-wider text-gray-400">
          Fin de l'événement dans
        </p>
        <EventCountdown :end-date="event.endDate" />
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

    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title gradient-text">Participants à l'honneur</h2>
        <p class="mt-2 text-gray-400">Les invités vedettes de cet événement</p>
        <div class="mt-8">
          <ParticipantsGrid
            :participants="featured"
            :loading="pLoading"
            empty-message="Aucun participant mis en avant."
          />
        </div>
        <div class="mt-6 text-center">
          <PrimaryButton to="/participants" variant="outline">
            Voir tous les participants
          </PrimaryButton>
        </div>
      </div>
    </section>

    <section class="py-16 bg-surface-elevated/50">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 class="section-title">À ne pas manquer</h2>
        <ScheduleTimeline :items="schedule" :loading="sLoading" :limit="4" />
        <div class="mt-6 text-center">
          <PrimaryButton to="/planning" variant="outline">
            Planning complet
          </PrimaryButton>
        </div>
      </div>
    </section>

    <AssociationSection :association="association" :loading="aLoading" />
    <RecentDonations :donations="donations" :loading="dLoading" :limit="5" />
    <FaqSection :items="faq" :loading="fLoading" :limit="4" />
  </div>
</template>
