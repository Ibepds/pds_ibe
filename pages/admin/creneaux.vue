<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { FreestyleSlot } from '~/types'
import { MOCK_FREESTYLE_SLOTS, MOCK_FREESTYLE_BOOKINGS } from '~/utils/mockData'

const { data: slots, loading, refresh } = useFirestoreCollection(
  'freestyleSlots',
  MOCK_FREESTYLE_SLOTS,
  { orderField: 'order', orderDirection: 'asc' },
)

const { data: bookings } = useFirestoreCollection(
  'freestyles',
  MOCK_FREESTYLE_BOOKINGS,
)

const { create, remove } = useAdminFirestore()

const feedback = ref('')
const error = ref('')
const newLabel = ref('')
const adding = ref(false)
const deleteTarget = ref<FreestyleSlot | null>(null)
const seeding = ref(false)

const usedLabels = computed(() =>
  bookings.value.filter((b) => b.status !== 'rejected').map((b) => b.slot),
)
const isUsed = (label: string) => usedLabels.value.includes(label)

const nextOrder = computed(() =>
  slots.value.length ? Math.max(...slots.value.map((s) => s.order)) + 1 : 1,
)

const addSlot = async () => {
  error.value = ''
  const label = newLabel.value.trim()
  if (!label) {
    error.value = 'Saisissez un libellé de créneau (ex. 10h28 – 10h36).'
    return
  }
  if (slots.value.some((s) => s.label === label)) {
    error.value = 'Ce créneau existe déjà.'
    return
  }
  adding.value = true
  try {
    await create('freestyleSlots', { label, order: nextOrder.value })
    feedback.value = `Créneau "${label}" ajouté.`
    newLabel.value = ''
    await refresh()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    adding.value = false
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  try {
    await remove('freestyleSlots', deleteTarget.value.id)
    feedback.value = `Créneau "${deleteTarget.value.label}" supprimé.`
    deleteTarget.value = null
    await refresh()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erreur'
  }
}

// Initialise la collection Firestore avec les 56 créneaux par défaut
const seedDefaults = async () => {
  seeding.value = true
  error.value = ''
  try {
    for (const s of MOCK_FREESTYLE_SLOTS) {
      if (!slots.value.some((existing) => existing.label === s.label)) {
        await create('freestyleSlots', { label: s.label, order: s.order })
      }
    }
    feedback.value = 'Créneaux par défaut importés.'
    await refresh()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    seeding.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">Créneaux freestyles</h1>
      <span class="text-sm text-gray-500">{{ slots.length }} créneau(x)</span>
    </div>

    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>
    <p v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</p>

    <!-- Ajout -->
    <form class="mb-6 rounded-lg border bg-white p-4" @submit.prevent="addSlot">
      <label class="block text-sm font-medium text-gray-700">Ajouter un créneau</label>
      <div class="mt-2 flex flex-wrap gap-3">
        <input
          v-model="newLabel"
          type="text"
          placeholder="ex. 10h28 – 10h36"
          class="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          :disabled="adding"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {{ adding ? 'Ajout…' : '+ Ajouter' }}
        </button>
      </div>
      <p class="mt-2 text-xs text-gray-400">
        Le créneau est ajouté à la fin de la liste. Vous pourrez le supprimer à tout moment.
      </p>
    </form>

    <!-- Liste -->
    <div v-if="loading" class="space-y-2">
      <div v-for="n in 6" :key="n" class="h-12 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div v-else-if="slots.length === 0" class="rounded-lg border border-dashed p-8 text-center">
      <p class="text-gray-400">Aucun créneau enregistré.</p>
      <button
        :disabled="seeding"
        class="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        @click="seedDefaults"
      >
        {{ seeding ? 'Import…' : 'Importer les 56 créneaux par défaut' }}
      </button>
    </div>

    <div v-else class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="slot in slots"
        :key="slot.id"
        class="flex items-center justify-between rounded-lg border bg-white px-3 py-2"
      >
        <div class="flex items-center gap-2">
          <span class="font-mono text-sm text-gray-900">{{ slot.label }}</span>
          <span
            v-if="isUsed(slot.label)"
            class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"
            title="Une réservation existe sur ce créneau"
          >
            réservé
          </span>
        </div>
        <button
          class="rounded p-1.5 text-red-600 hover:bg-red-50"
          title="Supprimer"
          @click="deleteTarget = slot"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <AdminConfirmModal
      :open="!!deleteTarget"
      title="Supprimer le créneau"
      :message="
        deleteTarget && isUsed(deleteTarget.label)
          ? `Attention : une réservation existe déjà sur le créneau ${deleteTarget.label}. La supprimer ne supprime pas la réservation associée.`
          : 'Ce créneau ne sera plus proposé aux participants.'
      "
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
