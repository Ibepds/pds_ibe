<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import { MOCK_DONATIONS } from '~/utils/mockData'
import { formatCurrency } from '~/utils/format'

const { data: donations, loading, refresh } = useFirestoreCollection(
  'donations',
  MOCK_DONATIONS,
  { orderField: 'createdAt', orderDirection: 'desc' },
)

// Coordonnées privées des donateurs (collection admin-only), jointes par sessionId
const { data: contacts, refresh: refreshContacts } = useFirestoreCollection<{
  id: string
  email?: string
  sessionId?: string
}>('donationContacts', [])

const emailBySession = computed(() => {
  const map: Record<string, string> = {}
  for (const c of contacts.value) {
    if (c.sessionId && c.email) map[c.sessionId] = c.email
  }
  return map
})

// E-mail : depuis donationContacts (prod) ou inline (jeu de démo)
const emailOf = (d: { sessionId?: string; email?: string }) =>
  (d.sessionId ? emailBySession.value[d.sessionId] : undefined) ?? d.email ?? ''

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
}))

const exportCsv = () => {
  const rows = [
    ['Date', 'E-mail', 'Pseudo', 'Montant (€)', 'Message'],
    ...donations.value.map((d) => [
      fmtDate(d.createdAt),
      emailOf(d),
      d.username,
      String(d.amount ?? 0).replace('.', ','),
      d.message ?? '',
    ]),
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
      <div class="flex gap-2">
        <button
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          @click="refreshAll"
        >
          Rafraîchir
        </button>
        <button
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          :disabled="!donations.length"
          @click="exportCsv"
        >
          Exporter CSV
        </button>
      </div>
    </div>
    <p class="mb-6 max-w-2xl text-sm text-gray-500">
      Liste des dons enregistrés après paiement Stripe. L'e-mail est celui saisi lors du checkout.
    </p>

    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 5" :key="n" class="h-20 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div
      v-else-if="donations.length === 0"
      class="rounded-lg border border-dashed p-8 text-center text-gray-400"
    >
      Aucun don enregistré pour le moment.
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 font-semibold text-gray-600">Date</th>
            <th class="px-4 py-3 font-semibold text-gray-600">E-mail</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Pseudo</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Montant</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Message</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="d in donations"
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
            <td class="max-w-xs truncate px-4 py-3 text-gray-600" :title="d.message">
              {{ d.message || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
