<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import { MOCK_EVENT } from '~/utils/mockData'

const { event, refresh } = useEvent()
const { set, ready } = useAdminFirestore()

const form = reactive({ ...MOCK_EVENT })
const saving = ref(false)
const feedback = ref<{ type: 'success' | 'error'; msg: string } | null>(null)

watch(event, (e) => {
  if (e) Object.assign(form, e)
}, { immediate: true })

const save = async () => {
  saving.value = true
  feedback.value = null
  try {
    await set('event', 'main', { ...form })
    feedback.value = { type: 'success', msg: 'Événement enregistré.' }
    await refresh()
  } catch (e: unknown) {
    feedback.value = {
      type: 'error',
      msg: e instanceof Error ? e.message : 'Erreur',
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="mb-6 text-xl font-bold text-gray-900">Configuration de l'événement</h1>
    <p v-if="!ready" class="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
      Mode démo : configurez Firebase pour sauvegarder en base.
    </p>
    <p
      v-if="feedback"
      class="mb-4 rounded-lg p-3 text-sm"
      :class="feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'"
    >
      {{ feedback.msg }}
    </p>

    <form class="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-6" @submit.prevent="save">
      <AdminFormInput v-model="form.name" label="Nom de l'événement" />
      <AdminFormInput v-model="form.tagline" label="Tagline" />
      <AdminFormInput v-model="form.organizerName" label="Organisateur" />
      <AdminFormInput v-model="form.heroTitle" label="Titre hero" />
      <AdminFormTextarea v-model="form.heroSubtitle" label="Sous-titre hero" />
      <AdminFormInput v-model="form.startDate" label="Date début (ISO)" type="datetime-local" />
      <AdminFormInput v-model="form.endDate" label="Date fin (ISO)" type="datetime-local" />
      <AdminFormInput v-model="form.donationGoal" label="Objectif (€)" type="number" />
      <AdminFormInput v-model="form.currentAmount" label="Montant actuel (€)" type="number" />
      <AdminFormInput v-model="form.donorsCount" label="Nombre de donateurs" type="number" />
      <AdminFormInput v-model="form.donationUrl" label="URL don" />
      <AdminFormInput v-model="form.liveUrl" label="URL live" />
      <label class="flex items-center gap-2">
        <input v-model="form.isLive" type="checkbox" class="rounded">
        <span class="text-sm text-gray-700">Live actif</span>
      </label>
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
