<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { EncheresDoc } from '~/types'
import { MOCK_ENCHERES } from '~/utils/mockData'

const { single: encheres, refresh } = useFirestoreCollection(
  'content',
  [{ id: 'encheres', ...MOCK_ENCHERES }],
  { docId: 'encheres' },
)
const { set, ready } = useAdminFirestore()
const { event } = useEvent()

const form = reactive<EncheresDoc>({
  ...MOCK_ENCHERES,
  lots: MOCK_ENCHERES.lots.map((l) => ({ ...l })),
})
const saving = ref(false)
const feedback = ref('')

watch(encheres, (e) => {
  if (e) {
    form.intro = e.intro ?? ''
    form.planningText = e.planningText ?? ''
    form.lots = (e.lots ?? []).map((l) => ({ ...l }))
  }
}, { immediate: true })

const addLot = () => form.lots.push({ title: '', description: '' })
const removeLot = (i: number) => form.lots.splice(i, 1)

const save = async () => {
  saving.value = true
  feedback.value = ''
  try {
    await set('content', 'encheres', {
      intro: form.intro,
      planningText: form.planningText,
      lots: form.lots.filter((l) => l.title || l.description),
    })
    feedback.value = 'Page Enchères enregistrée.'
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
    <h1 class="mb-2 text-xl font-bold text-gray-900">Page Enchères</h1>
    <p class="mb-6 max-w-2xl text-sm text-gray-500">
      Gérez le contenu de la page publique « Enchères solidaires ». Le lien eBay Live se règle dans
      <NuxtLink to="/admin/event" class="text-primary hover:underline">Événement</NuxtLink>
      (champ « URL eBay Live »).
    </p>

    <p v-if="!ready" class="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
      Mode démo : configurez Firebase pour sauvegarder en base.
    </p>
    <p
      v-if="event && !event.ebayLiveUrl"
      class="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
    >
      Aucun lien eBay Live défini pour le moment (à renseigner dans Événement).
    </p>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <form class="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6" @submit.prevent="save">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Texte « Comment ça fonctionne ? »</label>
        <textarea
          v-model="form.intro"
          rows="6"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <p class="mt-1 text-xs text-gray-400">Laissez une ligne vide pour séparer les paragraphes.</p>
      </div>

      <!-- Lots -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Lots aux enchères</span>
          <button type="button" class="text-sm text-primary" @click="addLot">+ Ajouter un lot</button>
        </div>
        <p v-if="form.lots.length === 0" class="mb-2 text-xs text-gray-400">
          Aucun lot ajouté : la page affichera « Les lots seront dévoilés prochainement ».
        </p>
        <div v-for="(lot, i) in form.lots" :key="i" class="mb-3 rounded-lg border border-gray-200 p-3">
          <div class="flex items-start gap-2">
            <div class="flex-1 space-y-2">
              <input
                v-model="lot.title"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="Titre du lot (ex. Casque dédicacé)"
              />
              <textarea
                v-model="lot.description"
                rows="2"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="Description du lot"
              />
            </div>
            <button type="button" class="rounded p-2 text-red-600 hover:bg-red-50" @click="removeLot(i)">✕</button>
          </div>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Texte « Planning des enchères »</label>
        <textarea
          v-model="form.planningText"
          rows="3"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
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
