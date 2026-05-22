<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { AssociationDoc } from '~/types'
import { MOCK_ASSOCIATION } from '~/utils/mockData'

const { single: association, refresh } = useFirestoreCollection(
  'association',
  [{ id: 'main', ...MOCK_ASSOCIATION }],
  { docId: 'main' },
)
const { set } = useAdminFirestore()

const form = reactive<AssociationDoc>({ ...MOCK_ASSOCIATION })
const saving = ref(false)
const feedback = ref('')

watch(association, (a) => {
  if (a) {
    const { id: _id, ...rest } = a
    Object.assign(form, rest)
  }
}, { immediate: true })

const addKeyNumber = () => {
  form.keyNumbers.push({ label: '', value: '' })
}

const save = async () => {
  saving.value = true
  try {
    await set('association', 'main', { ...form })
    feedback.value = 'Association enregistrée.'
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
    <h1 class="mb-6 text-xl font-bold text-gray-900">Association partenaire</h1>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <form class="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-6" @submit.prevent="save">
      <AdminFormInput v-model="form.name" label="Nom" />
      <AdminFormTextarea v-model="form.description" label="Description" />
      <AdminFormTextarea v-model="form.mission" label="Mission" />
      <AdminFormInput v-model="form.websiteUrl" label="Site web" />
      <AdminImageUpload
        label="Logo"
        storage-path="association/logo"
        :current-url="form.logoUrl"
        @uploaded="(url) => (form.logoUrl = url)"
      />

      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Chiffres clés</span>
          <button type="button" class="text-sm text-primary" @click="addKeyNumber">+ Ajouter</button>
        </div>
        <div
          v-for="(kn, i) in form.keyNumbers"
          :key="i"
          class="mb-2 grid grid-cols-2 gap-2"
        >
          <AdminFormInput v-model="kn.label" label="Label" />
          <AdminFormInput v-model="kn.value" label="Valeur" />
        </div>
      </div>

      <button
        type="submit"
        class="rounded-xl bg-primary px-6 py-2 text-white disabled:opacity-50"
        :disabled="saving"
      >
        {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </form>
  </div>
</template>
