<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { FreestyleBooking, FreestyleStatus } from '~/types'
import { MOCK_FREESTYLE_BOOKINGS, MOCK_FREESTYLE_SLOTS } from '~/utils/mockData'

const { data: bookings, loading, refresh } = useFirestoreCollection(
  'freestyles',
  MOCK_FREESTYLE_BOOKINGS,
  { orderField: 'createdAt', orderDirection: 'asc' },
)

const { data: slots } = useFirestoreCollection(
  'freestyleSlots',
  MOCK_FREESTYLE_SLOTS,
  { orderField: 'order', orderDirection: 'asc' },
)

const { update } = useAdminFirestore()

const feedback = ref('')
const filterStatus = ref<FreestyleStatus | 'all'>('all')

const filtered = computed(() => {
  if (filterStatus.value === 'all') return bookings.value
  return bookings.value.filter((b) => b.status === filterStatus.value)
})

const statusLabel: Record<FreestyleStatus, string> = {
  pending: 'En attente',
  validated: 'Validé',
  rejected: 'Refusé',
}

const statusClass: Record<FreestyleStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  validated: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const setStatus = async (booking: FreestyleBooking, status: FreestyleStatus) => {
  try {
    await update('freestyles', booking.id, { status })
    feedback.value = `Statut mis à jour : ${statusLabel[status]}`
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}

// Stats
const stats = computed(() => ({
  total: bookings.value.length,
  pending: bookings.value.filter((b) => b.status === 'pending').length,
  validated: bookings.value.filter((b) => b.status === 'validated').length,
  rejected: bookings.value.filter((b) => b.status === 'rejected').length,
  available: slots.value.length - bookings.value.filter((b) => b.status !== 'rejected').length,
}))

const exportCsv = () => {
  const rows = [
    ['Créneau', 'Pseudo', 'Email', 'Réseaux', 'Lien morceau', 'Message', 'Statut', 'Date inscription'],
    ...bookings.value.map((b) => [
      b.slot,
      b.pseudo,
      b.email,
      b.socialLinks ?? '',
      b.trackUrl,
      b.message ?? '',
      b.status,
      new Date(b.createdAt).toLocaleString('fr-FR'),
    ]),
  ]
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'freestyles-pds-humanity.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">Réservations Freestyles</h1>
      <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50" @click="exportCsv">
        Exporter CSV
      </button>
    </div>

    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
        <p class="text-xs text-gray-500">Total</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
        <p class="text-xs text-gray-500">En attente</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-green-600">{{ stats.validated }}</p>
        <p class="text-xs text-gray-500">Validés</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-red-600">{{ stats.rejected }}</p>
        <p class="text-xs text-gray-500">Refusés</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-blue-600">{{ stats.available }}</p>
        <p class="text-xs text-gray-500">Créneaux libres</p>
      </div>
    </div>

    <!-- Filtre -->
    <div class="mb-4 flex gap-2">
      <button
        v-for="opt in (['all', 'pending', 'validated', 'rejected'] as const)"
        :key="opt"
        class="rounded-full px-3 py-1 text-sm font-medium transition"
        :class="filterStatus === opt ? 'bg-primary text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
        @click="filterStatus = opt"
      >
        {{ opt === 'all' ? 'Tous' : statusLabel[opt] }}
      </button>
    </div>

    <!-- Liste -->
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 5" :key="n" class="h-20 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div v-else-if="filtered.length === 0" class="rounded-lg border border-dashed p-8 text-center text-gray-400">
      Aucune inscription
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="b in filtered"
        :key="b.id"
        class="rounded-lg border bg-white p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{{ b.slot }}</span>
              <span class="font-semibold text-gray-900">{{ b.pseudo }}</span>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="statusClass[b.status]"
              >
                {{ statusLabel[b.status] }}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500">{{ b.email }}</p>
            <div class="mt-2 flex flex-wrap gap-4 text-sm">
              <a v-if="b.trackUrl" :href="b.trackUrl" target="_blank" rel="noopener" class="text-blue-600 hover:underline truncate max-w-xs">
                Écouter le morceau
              </a>
              <span v-if="b.socialLinks" class="text-gray-400">{{ b.socialLinks }}</span>
            </div>
            <p v-if="b.message" class="mt-1 text-sm text-gray-400 italic">{{ b.message }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ new Date(b.createdAt).toLocaleString('fr-FR') }}</p>
          </div>
          <div class="flex flex-shrink-0 gap-2">
            <button
              v-if="b.status !== 'validated'"
              class="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              @click="setStatus(b, 'validated')"
            >
              Valider
            </button>
            <button
              v-if="b.status !== 'rejected'"
              class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              @click="setStatus(b, 'rejected')"
            >
              Refuser
            </button>
            <button
              v-if="b.status !== 'pending'"
              class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              @click="setStatus(b, 'pending')"
            >
              En attente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
