<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import { MOCK_EVENT } from '~/utils/mockData'
import { formatCurrency } from '~/utils/format'

const { event, loading } = useEvent()
const { data: participants, loading: pLoading } = useFirestoreCollection(
  'participants',
  [],
)
const { data: donations, loading: dLoading } = useFirestoreCollection(
  'donations',
  [],
)

const ev = computed(() => event.value ?? { ...MOCK_EVENT })
</script>

<template>
  <div>
    <h1 class="mb-6 text-xl font-bold text-gray-900">Tableau de bord</h1>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard
        label="Montant collecté"
        :value="formatCurrency(ev.currentAmount)"
        :hint="loading ? 'Chargement...' : undefined"
      />
      <AdminStatCard label="Objectif" :value="formatCurrency(ev.donationGoal)" />
      <AdminStatCard label="Donateurs" :value="ev.donorsCount" />
      <AdminStatCard
        label="Live"
        :value="ev.isLive ? 'En cours' : 'Hors ligne'"
        :hint="ev.isLive ? 'Diffusion active' : 'Diffusion inactive'"
      />
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="font-semibold text-gray-900">Participants</h2>
        <p class="mt-2 text-3xl font-bold text-primary">
          {{ pLoading ? '...' : participants.length }}
        </p>
        <NuxtLink to="/admin/participants" class="mt-4 inline-block text-sm text-primary hover:underline">
          Gérer les participants →
        </NuxtLink>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="font-semibold text-gray-900">Dons enregistrés</h2>
        <p class="mt-2 text-3xl font-bold text-primary">
          {{ dLoading ? '...' : donations.length }}
        </p>
        <NuxtLink to="/admin/donations" class="mt-4 inline-block text-sm text-primary hover:underline">
          Voir les dons et e-mails →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
