<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { ScheduleItem } from '~/types'
import { MOCK_SCHEDULE } from '~/utils/mockData'

const { data: schedule, loading, refresh } = useFirestoreCollection(
  'schedule',
  MOCK_SCHEDULE,
  { orderField: 'order', orderDirection: 'asc' },
)
const { create, update, remove } = useAdminFirestore()

const showForm = ref(false)
const deleteTarget = ref<ScheduleItem | null>(null)
const feedback = ref('')

const emptyForm = (): ScheduleItem => ({
  id: '',
  day: '',
  time: '',
  title: '',
  description: '',
  type: 'stream',
  order: 0,
})

const form = reactive(emptyForm())

const openCreate = () => {
  Object.assign(form, emptyForm())
  showForm.value = true
}

const openEdit = (row: Record<string, unknown>) => {
  Object.assign(form, row as unknown as ScheduleItem)
  showForm.value = true
}

const save = async () => {
  try {
    const payload = {
      day: form.day,
      time: form.time,
      title: form.title,
      description: form.description,
      type: form.type,
      order: Number(form.order),
    }
    if (form.id) await update('schedule', form.id, payload)
    else await create('schedule', payload)
    feedback.value = 'Créneau enregistré.'
    showForm.value = false
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value?.id) return
  try {
    await remove('schedule', deleteTarget.value.id)
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
      <h1 class="text-xl font-bold text-gray-900">Planning</h1>
      <button class="rounded-lg bg-primary px-4 py-2 text-white" @click="openCreate">+ Ajouter</button>
    </div>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <AdminTable
      :columns="[
        { key: 'day', label: 'Jour' },
        { key: 'time', label: 'Heure' },
        { key: 'title', label: 'Titre' },
        { key: 'type', label: 'Type' },
        { key: 'order', label: 'Ordre' },
      ]"
      :rows="schedule"
      :loading="loading"
      @edit="openEdit"
      @delete="(row) => { deleteTarget = schedule.find(s => s.id === row.id) ?? null }"
    />

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form class="w-full max-w-lg rounded-xl bg-white p-6" @submit.prevent="save">
        <h2 class="text-lg font-bold">{{ form.id ? 'Modifier' : 'Nouveau' }} créneau</h2>
        <div class="mt-4 space-y-3">
          <AdminFormInput v-model="form.day" label="Jour" />
          <AdminFormInput v-model="form.time" label="Heure" />
          <AdminFormInput v-model="form.title" label="Titre" />
          <AdminFormTextarea v-model="form.description" label="Description" />
          <label class="block text-sm text-gray-700">
            Type
            <select v-model="form.type" class="input-field mt-1">
              <option value="stream">Stream</option>
              <option value="show">Show</option>
              <option value="pause">Pause</option>
              <option value="special">Spécial</option>
            </select>
          </label>
          <AdminFormInput v-model="form.order" label="Ordre" type="number" />
        </div>
        <div class="mt-6 flex gap-3">
          <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-white">Enregistrer</button>
          <button type="button" class="rounded-lg border px-4 py-2" @click="showForm = false">Annuler</button>
        </div>
      </form>
    </div>

    <AdminConfirmModal
      :open="!!deleteTarget"
      title="Supprimer le créneau"
      message="Cette action est irréversible."
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
