<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

// ─────────────────────────────────────────────────────────────────────────
//  PAGE TEMPORAIRE — chargement des données de démo dans Firebase.
//  Pour la supprimer : effacer ce fichier (pages/admin/seed.vue) et la ligne
//  correspondante dans components/admin/AdminSidebar.vue.
// ─────────────────────────────────────────────────────────────────────────

import {
  MOCK_EVENT,
  MOCK_PRESENTATION,
  MOCK_LEGAL,
  MOCK_ASSOCIATIONS,
  MOCK_PARTICIPANTS,
  MOCK_SCHEDULE,
  MOCK_FAQ,
  MOCK_DONATIONS,
  MOCK_FREESTYLE_SLOTS,
} from '~/utils/mockData'

const { set, ready } = useAdminFirestore()

const running = ref(false)
const done = ref(false)
const logs = ref<string[]>([])
const errorMsg = ref('')

const stripId = <T extends { id?: string }>(obj: T) => {
  const { id: _id, ...rest } = obj
  return rest
}

const log = (msg: string) => logs.value.push(msg)

const seedCollection = async <T extends { id: string }>(
  name: string,
  items: T[],
) => {
  for (const item of items) {
    await set(name, item.id, stripId(item))
  }
  log(`✓ ${name} : ${items.length} document(s)`)
}

const runSeed = async () => {
  if (!ready) {
    errorMsg.value = 'Firebase non configuré.'
    return
  }
  if (!window.confirm('Charger les données de démo dans Firebase ? Les documents portant les mêmes identifiants seront écrasés.')) {
    return
  }
  running.value = true
  done.value = false
  errorMsg.value = ''
  logs.value = []
  try {
    await set('event', 'main', { ...MOCK_EVENT })
    log('✓ event/main')

    await set('content', 'presentation', { ...MOCK_PRESENTATION })
    log('✓ content/presentation')

    await set('content', 'legal', { ...MOCK_LEGAL })
    log('✓ content/legal')

    await seedCollection('associations', MOCK_ASSOCIATIONS)
    await seedCollection('participants', MOCK_PARTICIPANTS)
    await seedCollection('schedule', MOCK_SCHEDULE)
    await seedCollection('faq', MOCK_FAQ)
    await seedCollection('donations', MOCK_DONATIONS)
    await seedCollection('freestyleSlots', MOCK_FREESTYLE_SLOTS)

    log('Terminé ✅')
    done.value = true
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Erreur durant le chargement'
  } finally {
    running.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-xl font-bold text-gray-900">Charger les données de démo</h1>
    <p class="mb-6 max-w-2xl text-sm text-gray-500">
      Cet outil importe l'ensemble des données de démonstration (événement, présentation,
      associations, participants, programme, FAQ, dons, créneaux de freestyle) dans Firestore.
      Pratique pour initialiser le site rapidement. Vous pourrez ensuite tout modifier depuis
      l'administration.
    </p>

    <div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      ⚠️ Outil temporaire : à supprimer une fois le site initialisé
      (fichier <code>pages/admin/seed.vue</code> + ligne dans la sidebar).
      Les documents existants portant les mêmes identifiants seront écrasés.
    </div>

    <p v-if="!ready" class="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
      Mode démo : configurez Firebase pour pouvoir charger les données.
    </p>

    <button
      class="rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      :disabled="running || !ready"
      @click="runSeed"
    >
      {{ running ? 'Chargement…' : 'Charger les données de démo' }}
    </button>

    <p v-if="errorMsg" class="mt-4 text-sm text-red-600">{{ errorMsg }}</p>

    <div v-if="logs.length" class="mt-6 max-w-md rounded-lg border bg-white p-4">
      <p v-for="(l, i) in logs" :key="i" class="font-mono text-sm text-gray-700">{{ l }}</p>
    </div>

    <p v-if="done" class="mt-4 text-sm font-medium text-green-700">
      Données chargées. Vous pouvez maintenant supprimer cet outil.
    </p>
  </div>
</template>
