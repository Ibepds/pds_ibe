<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { AssociationDoc } from '~/types'
import { MOCK_ASSOCIATIONS } from '~/utils/mockData'

const { data: associations, loading, refresh } = useFirestoreCollection(
  'associations',
  MOCK_ASSOCIATIONS,
)
const { create, update, remove } = useAdminFirestore()

const showForm = ref(false)
const deleteTarget = ref<(AssociationDoc & { id?: string }) | null>(null)
const feedback = ref('')
const saving = ref(false)

const emptyForm = (): AssociationDoc & { id: string } => ({
  id: '',
  name: '',
  description: '',
  mission: '',
  websiteUrl: '',
  logoUrl: '',
  keyNumbers: [],
})

const form = reactive(emptyForm())

const openCreate = () => {
  Object.assign(form, emptyForm())
  showForm.value = true
}

const openEdit = (asso: AssociationDoc & { id?: string }) => {
  Object.assign(form, {
    ...emptyForm(),
    ...asso,
    id: asso.id ?? '',
    keyNumbers: asso.keyNumbers ? asso.keyNumbers.map((k) => ({ ...k })) : [],
  })
  showForm.value = true
}

const addKeyNumber = () => form.keyNumbers.push({ label: '', value: '' })
const removeKeyNumber = (i: number) => form.keyNumbers.splice(i, 1)

const save = async () => {
  saving.value = true
  feedback.value = ''
  try {
    const payload = {
      name: form.name,
      description: form.description,
      mission: form.mission,
      websiteUrl: form.websiteUrl,
      logoUrl: form.logoUrl,
      keyNumbers: form.keyNumbers.filter((k) => k.label || k.value),
    }
    if (form.id) await update('associations', form.id, payload)
    else await create('associations', payload)
    feedback.value = 'Association enregistrée.'
    showForm.value = false
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    saving.value = false
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value?.id) return
  try {
    await remove('associations', deleteTarget.value.id)
    deleteTarget.value = null
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">Associations soutenues</h1>
      <button class="rounded-lg bg-primary px-4 py-2 text-white" @click="openCreate">+ Ajouter</button>
    </div>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <div v-if="loading" class="space-y-2">
      <div v-for="n in 2" :key="n" class="h-24 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div v-else-if="associations.length === 0" class="rounded-lg border border-dashed p-8 text-center text-gray-400">
      Aucune association. Cliquez sur « + Ajouter ».
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="asso in associations"
        :key="asso.id ?? asso.name"
        class="flex items-center justify-between rounded-lg border bg-white p-4"
      >
        <div class="flex items-center gap-3">
          <div
            v-if="asso.logoUrl"
            class="h-12 w-12 overflow-hidden rounded-lg"
          >
            <img
              :src="asso.logoUrl"
              :alt="`Logo ${asso.name}`"
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            v-else
            class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-500"
          >
            {{ asso.name.charAt(0) }}
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ asso.name }}</p>
            <p class="text-sm text-gray-500 line-clamp-1">{{ asso.mission }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50" @click="openEdit(asso)">
            Modifier
          </button>
          <button class="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50" @click="deleteTarget = asso">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Formulaire modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6" @submit.prevent="save">
        <h2 class="text-lg font-bold">{{ form.id ? 'Modifier' : 'Nouvelle' }} association</h2>
        <div class="mt-4 space-y-3">
          <AdminFormInput v-model="form.name" label="Nom" />
          <AdminFormTextarea v-model="form.description" label="Description" />
          <AdminFormTextarea v-model="form.mission" label="Mission" />
          <AdminFormInput v-model="form.websiteUrl" label="Site web" />
          <AdminImageUpload
            label="Logo"
            storage-path="associations"
            :current-url="form.logoUrl"
            @uploaded="(url) => (form.logoUrl = url)"
          />

          <div>
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Chiffres clés</span>
              <button type="button" class="text-sm text-primary" @click="addKeyNumber">+ Ajouter</button>
            </div>
            <div v-for="(kn, i) in form.keyNumbers" :key="i" class="mb-2 flex items-end gap-2">
              <div class="grid flex-1 grid-cols-2 gap-2">
                <AdminFormInput v-model="kn.label" label="Label" />
                <AdminFormInput v-model="kn.value" label="Valeur" />
              </div>
              <button type="button" class="mb-1 rounded p-2 text-red-600 hover:bg-red-50" @click="removeKeyNumber(i)">
                ✕
              </button>
            </div>
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button type="submit" :disabled="saving" class="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50">
            {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
          <button type="button" class="rounded-lg border px-4 py-2" @click="showForm = false">Annuler</button>
        </div>
      </form>
    </div>

    <AdminConfirmModal
      :open="!!deleteTarget"
      title="Supprimer l'association"
      message="Cette action est irréversible."
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
