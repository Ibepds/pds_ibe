<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { PresentationDoc } from '~/types'
import { MOCK_PRESENTATION } from '~/utils/mockData'
import { DA_ICON_OPTIONS } from '~/utils/daIcons'

const { single: content, refresh } = useFirestoreCollection(
  'content',
  [{ id: 'presentation', ...MOCK_PRESENTATION }],
  { docId: 'presentation' },
)
const { set, ready } = useAdminFirestore()

const form = reactive<PresentationDoc>({
  ...MOCK_PRESENTATION,
  conceptCards: MOCK_PRESENTATION.conceptCards.map((c) => ({ ...c })),
  platforms: MOCK_PRESENTATION.platforms.map((p) => ({ ...p })),
})
const saving = ref(false)
const feedback = ref('')

watch(content, (c) => {
  if (c) {
    form.eventText = c.eventText ?? ''
    form.porteurText = c.porteurText ?? ''
    form.conceptCards = (c.conceptCards ?? []).map((x) => ({ ...x }))
    form.platforms = (c.platforms ?? []).map((x) => ({ ...x }))
  }
}, { immediate: true })

const addCard = () => form.conceptCards.push({ icon: 'picto.highFive', title: '', text: '' })
const removeCard = (i: number) => form.conceptCards.splice(i, 1)
const addPlatform = () => form.platforms.push({ icon: 'cgpt.sparkles', name: '' })
const removePlatform = (i: number) => form.platforms.splice(i, 1)

const save = async () => {
  saving.value = true
  feedback.value = ''
  try {
    await set('content', 'presentation', {
      eventText: form.eventText,
      porteurText: form.porteurText,
      conceptCards: form.conceptCards.filter((c) => c.title || c.text),
      platforms: form.platforms.filter((p) => p.name),
    })
    feedback.value = 'Présentation enregistrée.'
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-xl font-bold text-gray-900">Textes de présentation</h1>
    <p v-if="!ready" class="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
      Mode démo : configurez Firebase pour sauvegarder en base.
    </p>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <form class="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6" @submit.prevent="save">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Texte « L'événement »</label>
        <textarea
          v-model="form.eventText"
          rows="6"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p class="mt-1 text-xs text-gray-400">Laissez une ligne vide pour séparer les paragraphes.</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Texte « Le porteur du projet »</label>
        <textarea
          v-model="form.porteurText"
          rows="5"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <!-- Cartes concept -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Cartes « Le concept »</span>
          <button type="button" class="text-sm text-primary" @click="addCard">+ Ajouter une carte</button>
        </div>
        <div v-for="(card, i) in form.conceptCards" :key="i" class="mb-3 rounded-lg border border-gray-200 p-3">
          <div class="flex items-start gap-2">
            <div class="flex flex-col items-center gap-1">
              <DaIcon :icon="card.icon" class="h-8 w-8" />
              <select
                v-model="card.icon"
                class="w-28 rounded-lg border border-gray-300 px-1 py-1 text-xs text-gray-700"
              >
                <option v-for="opt in DA_ICON_OPTIONS" :key="opt.key" :value="opt.key">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div class="flex-1 space-y-2">
              <input
                v-model="card.title"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Titre"
              />
              <textarea
                v-model="card.text"
                rows="2"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Description"
              />
            </div>
            <button type="button" class="rounded p-2 text-red-600 hover:bg-red-50" aria-label="Supprimer" @click="removeCard(i)">
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Plateformes -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Plateformes de diffusion</span>
          <button type="button" class="text-sm text-primary" @click="addPlatform">+ Ajouter une plateforme</button>
        </div>
        <div v-for="(p, i) in form.platforms" :key="i" class="mb-2 flex items-center gap-2">
          <div class="flex flex-col items-center gap-1">
            <DaIcon :icon="p.icon" class="h-7 w-7" />
            <select
              v-model="p.icon"
              class="w-28 rounded-lg border border-gray-300 px-1 py-1 text-xs text-gray-700"
            >
              <option v-for="opt in DA_ICON_OPTIONS" :key="opt.key" :value="opt.key">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <input
            v-model="p.name"
            class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Nom de la plateforme"
          />
          <button type="button" class="rounded p-2 text-red-600 hover:bg-red-50" aria-label="Supprimer" @click="removePlatform(i)">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="rounded-xl bg-primary px-6 py-2 text-white hover:bg-primary-dark disabled:opacity-50"
        :disabled="saving"
      >
        {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </form>
  </div>
</template>
