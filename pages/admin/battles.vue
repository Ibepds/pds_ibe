<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { BattleInscription, BattlesDoc } from '~/types'
import { MOCK_BATTLES } from '~/utils/mockData'

const { data: inscriptions, loading, refresh } = useFirestoreCollection<BattleInscription>(
  'battleInscriptions',
  [],
  { orderField: 'createdAt', orderDirection: 'desc' },
)
const { remove, set } = useAdminFirestore()

// --- Contenu éditable de la section Battles (content/battles) ---
const { single: battlesDoc, refresh: refreshContent } = useFirestoreCollection(
  'content',
  [{ id: 'battles', ...MOCK_BATTLES }],
  { docId: 'battles' },
)
const content = reactive<BattlesDoc>({ ...MOCK_BATTLES })
watch(
  battlesDoc,
  (d) => {
    if (d) Object.assign(content, { ...MOCK_BATTLES, ...d })
  },
  { immediate: true },
)
const savingContent = ref(false)
const contentFeedback = ref('')
const saveContent = async () => {
  savingContent.value = true
  contentFeedback.value = ''
  try {
    const { id, createdAt, updatedAt, ...payload } = content
    await set('content', 'battles', payload as Record<string, unknown>)
    contentFeedback.value = 'Contenu Battles enregistré.'
    await refreshContent()
  } catch (e: unknown) {
    contentFeedback.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    savingContent.value = false
  }
}

const CONTENT_FIELDS: { key: keyof BattlesDoc; label: string; textarea?: boolean }[] = [
  { key: 'pageTitle', label: 'Titre de la page' },
  { key: 'pageLead', label: 'Accroche de la page', textarea: true },
  { key: 'chooseLabel', label: 'Libellé du choix de battle' },
  { key: 'ctaTitle', label: 'CTA — Titre (accueil & programme)' },
  { key: 'ctaText', label: 'CTA — Texte', textarea: true },
  { key: 'ctaButton', label: 'CTA — Bouton' },
  { key: 'djLabel', label: 'DJ Battle — Nom' },
  { key: 'djDesc', label: 'DJ Battle — Description', textarea: true },
  { key: 'djSlot', label: 'DJ Battle — Créneau' },
  { key: 'versusLabel', label: 'Battle Versus — Nom' },
  { key: 'versusDesc', label: 'Battle Versus — Description', textarea: true },
  { key: 'versusSlot', label: 'Battle Versus — Créneau' },
]

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
    <!-- Contenu éditable de la section Battles -->
    <section class="mb-10">
      <h1 class="mb-1 text-xl font-bold text-gray-900">Contenu Battles</h1>
      <p class="mb-4 text-sm text-gray-500">
        Textes des CTA (accueil & programme), de la page d'inscription et créneaux des battles.
      </p>
      <p v-if="contentFeedback" class="mb-4 text-sm text-green-700">{{ contentFeedback }}</p>
      <form class="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-2" @submit.prevent="saveContent">
        <div v-for="f in CONTENT_FIELDS" :key="f.key" :class="f.textarea ? 'md:col-span-2' : ''">
          <label class="mb-1 block text-sm font-medium text-gray-700">{{ f.label }}</label>
          <textarea
            v-if="f.textarea"
            v-model="content[f.key]"
            rows="2"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            v-else
            v-model="content[f.key]"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div class="md:col-span-2">
          <button
            type="submit"
            class="rounded-xl bg-primary px-6 py-2 text-white hover:bg-primary-dark disabled:opacity-50"
            :disabled="savingContent"
          >
            {{ savingContent ? 'Enregistrement…' : 'Enregistrer le contenu' }}
          </button>
        </div>
      </form>
    </section>

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
