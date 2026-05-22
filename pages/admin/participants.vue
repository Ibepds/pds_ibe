<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { Participant } from '~/types'
import { MOCK_PARTICIPANTS } from '~/utils/mockData'

const { data: participants, loading, refresh } = useFirestoreCollection(
  'participants',
  MOCK_PARTICIPANTS,
)
const { create, update, remove } = useAdminFirestore()

const editing = ref<Participant | null>(null)
const showForm = ref(false)
const deleteTarget = ref<Participant | null>(null)
const feedback = ref('')

const emptyForm = (): Participant => ({
  id: '',
  pseudo: '',
  avatarUrl: '',
  role: 'streamer',
  category: '',
  twitchUrl: '',
  instagramUrl: '',
  amountRaised: 0,
  isFeatured: false,
})

const form = reactive(emptyForm())

const openCreate = () => {
  Object.assign(form, emptyForm())
  editing.value = null
  showForm.value = true
}

const openEdit = (row: Record<string, unknown>) => {
  Object.assign(form, row as Participant)
  editing.value = form
  showForm.value = true
}

const save = async () => {
  try {
    const payload = {
      pseudo: form.pseudo,
      avatarUrl: form.avatarUrl,
      role: form.role,
      category: form.category,
      twitchUrl: form.twitchUrl || '',
      instagramUrl: form.instagramUrl || '',
      amountRaised: Number(form.amountRaised),
      isFeatured: form.isFeatured,
    }
    if (form.id) {
      await update('participants', form.id, payload)
    } else {
      await create('participants', payload)
    }
    feedback.value = 'Participant enregistré.'
    showForm.value = false
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value?.id) return
  try {
    await remove('participants', deleteTarget.value.id)
    feedback.value = 'Participant supprimé.'
    deleteTarget.value = null
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}

const tableRows = computed(() =>
  participants.value.map((p) => ({
    id: p.id,
    pseudo: p.pseudo,
    role: p.role,
    category: p.category,
    amountRaised: p.amountRaised,
    isFeatured: p.isFeatured ? 'Oui' : 'Non',
  })),
)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">Participants</h1>
      <button class="rounded-lg bg-primary px-4 py-2 text-white" @click="openCreate">
        + Ajouter
      </button>
    </div>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <AdminTable
      :columns="[
        { key: 'pseudo', label: 'Pseudo' },
        { key: 'role', label: 'Rôle' },
        { key: 'category', label: 'Catégorie' },
        { key: 'amountRaised', label: 'Collecté' },
        { key: 'isFeatured', label: 'Vedette' },
      ]"
      :rows="tableRows"
      :loading="loading"
      @edit="openEdit"
      @delete="(row) => { deleteTarget = participants.find(p => p.id === row.id) ?? null }"
    />

    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <form
        class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6"
        @submit.prevent="save"
      >
        <h2 class="text-lg font-bold">{{ form.id ? 'Modifier' : 'Nouveau' }} participant</h2>
        <div class="mt-4 space-y-3">
          <AdminFormInput v-model="form.pseudo" label="Pseudo" required />
          <AdminFormInput v-model="form.category" label="Catégorie" />
          <label class="block text-sm text-gray-700">
            Rôle
            <select v-model="form.role" class="input-field mt-1">
              <option value="streamer">Streamer</option>
              <option value="artiste">Artiste</option>
              <option value="invite">Invité</option>
            </select>
          </label>
          <AdminFormInput v-model="form.twitchUrl" label="Twitch URL" />
          <AdminFormInput v-model="form.instagramUrl" label="Instagram URL" />
          <AdminFormInput v-model="form.amountRaised" label="Montant collecté" type="number" />
          <AdminImageUpload
            label="Avatar"
            :storage-path="`participants/${form.id || 'new'}/avatar`"
            :current-url="form.avatarUrl"
            @uploaded="(url) => (form.avatarUrl = url)"
          />
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.isFeatured" type="checkbox">
            Participant vedette
          </label>
        </div>
        <div class="mt-6 flex gap-3">
          <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-white">Enregistrer</button>
          <button type="button" class="rounded-lg border px-4 py-2" @click="showForm = false">Annuler</button>
        </div>
      </form>
    </div>

    <AdminConfirmModal
      :open="!!deleteTarget"
      title="Supprimer le participant"
      message="Cette action est irréversible."
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
