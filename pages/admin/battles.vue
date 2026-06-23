<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { BattleInscription } from '~/types'

const { data: inscriptions, loading, refresh } = useFirestoreCollection<BattleInscription>(
  'battleInscriptions',
  [],
  { orderField: 'createdAt', orderDirection: 'desc' },
)
const { remove } = useAdminFirestore()

const feedback = ref('')
const deleteTarget = ref<BattleInscription | null>(null)
const filter = ref<'all' | 'battle-dj' | 'versus'>('all')

const eventLabel = (v: string) => (v === 'battle-dj' ? 'Battle de DJ' : v === 'versus' ? 'Battle Versus' : v)

const filtered = computed(() =>
  filter.value === 'all' ? inscriptions.value : inscriptions.value.filter((i) => i.event === filter.value),
)

const stats = computed(() => ({
  total: inscriptions.value.length,
  dj: inscriptions.value.filter((i) => i.event === 'battle-dj').length,
  versus: inscriptions.value.filter((i) => i.event === 'versus').length,
}))

const fmtDate = (v: unknown) => {
  if (!v) return ''
  const d = (v as { toDate?: () => Date })?.toDate
    ? (v as { toDate: () => Date }).toDate()
    : new Date(v as string)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR')
}

const confirmDelete = async () => {
  if (!deleteTarget.value?.id) return
  try {
    await remove('battleInscriptions', deleteTarget.value.id)
    feedback.value = 'Inscription supprimée.'
    deleteTarget.value = null
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}

const exportCsv = () => {
  const rows = [
    ['Date', 'Battle', 'Nom', 'Prénom', 'E-mail'],
    ...inscriptions.value.map((i) => [
      fmtDate(i.createdAt),
      eventLabel(i.event),
      i.lastName,
      i.firstName,
      i.email,
    ]),
  ]
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `battles-pds-humanity-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-bold text-gray-900">Inscriptions Battles</h1>
      <button
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        :disabled="!inscriptions.length"
        @click="exportCsv"
      >
        Exporter CSV
      </button>
    </div>
    <p class="mb-6 max-w-2xl text-sm text-gray-500">
      Inscriptions reçues via le formulaire « Battle de DJ / Battle Versus ».
    </p>

    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <div class="mb-6 grid grid-cols-3 gap-3">
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
        <p class="text-xs text-gray-500">Total</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-primary">{{ stats.dj }}</p>
        <p class="text-xs text-gray-500">Battle de DJ</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-primary">{{ stats.versus }}</p>
        <p class="text-xs text-gray-500">Battle Versus</p>
      </div>
    </div>

    <div class="mb-4 flex gap-2">
      <button
        v-for="opt in (['all', 'battle-dj', 'versus'] as const)"
        :key="opt"
        class="rounded-full px-3 py-1 text-sm font-medium transition"
        :class="filter === opt ? 'bg-primary text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
        @click="filter = opt"
      >
        {{ opt === 'all' ? 'Tous' : eventLabel(opt) }}
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-16 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div v-else-if="filtered.length === 0" class="rounded-lg border border-dashed p-8 text-center text-gray-400">
      Aucune inscription pour le moment.
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 font-semibold text-gray-600">Date</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Battle</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Nom</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Prénom</th>
            <th class="px-4 py-3 font-semibold text-gray-600">E-mail</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in filtered" :key="i.id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="whitespace-nowrap px-4 py-3 text-gray-600">{{ fmtDate(i.createdAt) }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {{ eventLabel(i.event) }}
              </span>
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ i.lastName }}</td>
            <td class="px-4 py-3 text-gray-700">{{ i.firstName }}</td>
            <td class="px-4 py-3">
              <a :href="`mailto:${i.email}`" class="text-blue-600 hover:underline">{{ i.email }}</a>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                @click="deleteTarget = i"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminConfirmModal
      :open="!!deleteTarget"
      title="Supprimer l'inscription"
      message="Cette action est irréversible."
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
