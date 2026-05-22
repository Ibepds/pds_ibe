<script setup lang="ts">
import { MOCK_SCHEDULE } from '~/utils/mockData'

const { data: schedule, loading, error } = useFirestoreCollection(
  'schedule',
  MOCK_SCHEDULE,
  { orderField: 'order', orderDirection: 'asc' },
)
</script>

<template>
  <div class="py-12">
    <div class="mx-auto max-w-4xl px-4 lg:px-8">
      <h1 class="section-title gradient-text">Planning</h1>
      <p class="mt-2 text-gray-400">
        Programme complet de l'événement caritatif Ibé PDS
      </p>
      <p v-if="error" class="mt-4 text-accent-rose">{{ error }}</p>
      <div class="mt-10">
        <ScheduleTimeline :items="schedule" :loading="loading" />
      </div>
    </div>
  </div>
</template>
