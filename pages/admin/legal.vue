<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { LegalDoc } from '~/types'
import { MOCK_LEGAL } from '~/utils/mockData'

const { single: legal, refresh } = useFirestoreCollection(
  'content',
  [{ id: 'legal', ...MOCK_LEGAL }],
  { docId: 'legal' },
)
const { set, ready } = useAdminFirestore()

const form = reactive<LegalDoc>({ ...MOCK_LEGAL })
const saving = ref(false)
const feedback = ref('')

watch(legal, (l) => {
  if (l) {
    const { id: _id, ...rest } = l
    Object.assign(form, rest)
  }
}, { immediate: true })

const save = async () => {
  saving.value = true
  feedback.value = ''
  try {
    await set('content', 'legal', {
      editorLegalForm: form.editorLegalForm,
      editorAddress: form.editorAddress,
      editorSiret: form.editorSiret,
      publicationDirector: form.publicationDirector,
      contactEmail: form.contactEmail,
      hostName: form.hostName,
      hostAddress: form.hostAddress,
      retentionMonths: form.retentionMonths,
      privacyUpdatedAt: form.privacyUpdatedAt,
    })
    feedback.value = 'Informations légales enregistrées.'
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
    <h1 class="mb-2 text-xl font-bold text-gray-900">Mentions légales & confidentialité</h1>
    <p class="mb-6 max-w-2xl text-sm text-gray-500">
      Ces informations alimentent automatiquement les pages publiques « Mentions légales » et
      « Politique de confidentialité ». Les champs laissés vides afficheront « À préciser ».
    </p>

    <p v-if="!ready" class="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
      Mode démo : configurez Firebase pour sauvegarder en base.
    </p>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <form class="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6" @submit.prevent="save">
      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Éditeur</h2>
        <div class="space-y-3">
          <AdminFormInput v-model="form.editorLegalForm" label="Forme juridique (ex. SAS, association loi 1901, auto-entrepreneur)" />
          <AdminFormInput v-model="form.editorAddress" label="Adresse postale" />
          <AdminFormInput v-model="form.editorSiret" label="SIRET" />
          <AdminFormInput v-model="form.publicationDirector" label="Directeur de la publication" />
          <AdminFormInput v-model="form.contactEmail" label="E-mail de contact (légal / RGPD)" type="email" />
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Hébergeur</h2>
        <div class="space-y-3">
          <AdminFormInput v-model="form.hostName" label="Nom de l'hébergeur" />
          <AdminFormInput v-model="form.hostAddress" label="Adresse de l'hébergeur" />
        </div>
      </div>

      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Confidentialité</h2>
        <div class="space-y-3">
          <AdminFormInput v-model="form.retentionMonths" label="Durée de conservation des données (en mois)" />
          <AdminFormInput v-model="form.privacyUpdatedAt" label="Date de dernière mise à jour (ex. juin 2026)" />
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
