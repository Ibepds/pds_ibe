<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { DonationContact } from '~/types'
import { MOCK_DONATIONS } from '~/utils/mockData'
import { formatCurrency } from '~/utils/format'

const { data: donations, loading, refresh } = useFirestoreCollection(
  'donations',
  MOCK_DONATIONS,
  { orderField: 'createdAt', orderDirection: 'desc' },
)

// Coordonnées privées des donateurs (collection admin-only), jointes par sessionId
const { data: contacts, refresh: refreshContacts } = useFirestoreCollection<DonationContact>(
  'donationContacts',
  [],
)

const contactBySession = computed(() => {
  const map: Record<string, DonationContact> = {}
  for (const c of contacts.value) {
    if (c.sessionId) map[c.sessionId] = c
  }
  return map
})

const contactOf = (d: { sessionId?: string }) =>
  (d.sessionId ? contactBySession.value[d.sessionId] : undefined)

// E-mail : depuis donationContacts (prod) ou inline (jeu de démo)
const emailOf = (d: { sessionId?: string; email?: string }) =>
  contactOf(d)?.email ?? d.email ?? ''

const raffleOnly = ref(false)

const displayedDonations = computed(() =>
  raffleOnly.value
    ? donations.value.filter((d) => contactOf(d)?.raffleParticipate === true)
    : donations.value,
)

const refreshAll = () => {
  refresh()
  refreshContacts()
}

const fmtDate = (v: unknown) => {
  if (!v) return ''
  const d = (v as { toDate?: () => Date })?.toDate
    ? (v as { toDate: () => Date }).toDate()
    : new Date(v as string)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR')
}

const stats = computed(() => ({
  total: donations.value.length,
  amount: donations.value.reduce((sum, d) => sum + (d.amount ?? 0), 0),
  withEmail: donations.value.filter((d) => emailOf(d)).length,
  raffle: donations.value.filter((d) => contactOf(d)?.raffleParticipate === true).length,
}))

const exportCsv = () => {
  const rows = [
    [
      'Date',
      'E-mail',
      'Pseudo',
      'Montant (€)',
      'Message',
      'Tirage au sort',
      'Téléphone',
      'Instagram',
      'TikTok',
    ],
    ...displayedDonations.value.map((d) => {
      const c = contactOf(d)
      return [
        fmtDate(d.createdAt),
        emailOf(d),
        d.username,
        String(d.amount ?? 0).replace('.', ','),
        d.message ?? '',
        c?.raffleParticipate ? 'Oui' : 'Non',
        c?.rafflePhone ?? '',
        c?.raffleInstagram ?? '',
        c?.raffleTiktok ?? '',
      ]
    }),
  ]
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
    .join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dons-pds-humanity-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-bold text-gray-900">Dons</h1>
      <div class="flex flex-wrap gap-2">
        <label class="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700">
          <input v-model="raffleOnly" type="checkbox" class="rounded" />
          Tirage au sort uniquement
        </label>
        <button
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          @click="refreshAll"
        >
          Rafraîchir
        </button>
        <button
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          :disabled="!displayedDonations.length"
          @click="exportCsv"
        >
          Exporter CSV
        </button>
      </div>
    </div>
    <p class="mb-6 max-w-2xl text-sm text-gray-500">
      Liste des dons enregistrés après paiement (PayPal ou Stripe). L'e-mail est celui saisi lors du checkout.
    </p>

    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
        <p class="text-xs text-gray-500">Dons enregistrés</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-primary">{{ formatCurrency(stats.amount) }}</p>
        <p class="text-xs text-gray-500">Montant total</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-gray-900">{{ stats.withEmail }}</p>
        <p class="text-xs text-gray-500">Avec e-mail</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-green-600">{{ stats.raffle }}</p>
        <p class="text-xs text-gray-500">Tirage au sort</p>
      </div>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 5" :key="n" class="h-20 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div
      v-else-if="displayedDonations.length === 0"
      class="rounded-lg border border-dashed p-8 text-center text-gray-400"
    >
      {{ raffleOnly ? 'Aucun participant au tirage au sort pour le moment.' : 'Aucun don enregistré pour le moment.' }}
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 font-semibold text-gray-600">Date</th>
            <th class="px-4 py-3 font-semibold text-gray-600">E-mail</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Pseudo</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Montant</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Tirage</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Contact tirage</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Message</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="d in displayedDonations"
            :key="d.id"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <td class="whitespace-nowrap px-4 py-3 text-gray-600">{{ fmtDate(d.createdAt) }}</td>
            <td class="px-4 py-3">
              <a
                v-if="emailOf(d)"
                :href="`mailto:${emailOf(d)}`"
                class="text-blue-600 hover:underline"
              >
                {{ emailOf(d) }}
              </a>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ d.username }}</td>
            <td class="whitespace-nowrap px-4 py-3 font-semibold text-primary">
              {{ formatCurrency(d.amount) }}
            </td>
            <td class="whitespace-nowrap px-4 py-3">
              <span
                v-if="contactOf(d)?.raffleParticipate"
                class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
              >
                Oui
              </span>
              <span v-else class="text-gray-400">Non</span>
            </td>
            <td class="px-4 py-3 text-xs text-gray-600">
              <template v-if="contactOf(d)?.raffleParticipate">
                <div v-if="contactOf(d)?.rafflePhone">{{ contactOf(d)?.rafflePhone }}</div>
                <div v-if="contactOf(d)?.raffleInstagram">@{{ contactOf(d)?.raffleInstagram }}</div>
                <div v-if="contactOf(d)?.raffleTiktok">@{{ contactOf(d)?.raffleTiktok }}</div>
              </template>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="max-w-xs truncate px-4 py-3 text-gray-600" :title="d.message">
              {{ d.message || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
