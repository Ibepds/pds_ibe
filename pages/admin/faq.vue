<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { FaqItem } from '~/types'
import { MOCK_FAQ } from '~/utils/mockData'

const { data: faq, loading, refresh } = useFirestoreCollection('faq', MOCK_FAQ, {
  orderField: 'order',
  orderDirection: 'asc',
})
const { create, update, remove } = useAdminFirestore()

const showForm = ref(false)
const deleteTarget = ref<FaqItem | null>(null)
const feedback = ref('')

const emptyForm = (): FaqItem => ({
  id: '',
  question: '',
  answer: '',
  order: 0,
})

const form = reactive(emptyForm())

const openCreate = () => {
  Object.assign(form, emptyForm())
  showForm.value = true
}

const openEdit = (row: Record<string, unknown>) => {
  Object.assign(form, row as FaqItem)
  showForm.value = true
}

const save = async () => {
  try {
    const payload = {
      question: form.question,
      answer: form.answer,
      order: Number(form.order),
    }
    if (form.id) await update('faq', form.id, payload)
    else await create('faq', payload)
    feedback.value = 'FAQ enregistrée.'
    showForm.value = false
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value?.id) return
  try {
    await remove('faq', deleteTarget.value.id)
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
      <h1 class="text-xl font-bold text-gray-900">FAQ</h1>
      <button class="rounded-lg bg-primary px-4 py-2 text-white" @click="openCreate">+ Ajouter</button>
    </div>
    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <AdminTable
      :columns="[
        { key: 'question', label: 'Question' },
        { key: 'order', label: 'Ordre' },
      ]"
      :rows="faq"
      :loading="loading"
      @edit="openEdit"
      @delete="(row) => { deleteTarget = faq.find(f => f.id === row.id) ?? null }"
    />

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form class="w-full max-w-lg rounded-xl bg-white p-6" @submit.prevent="save">
        <h2 class="text-lg font-bold">{{ form.id ? 'Modifier' : 'Nouvelle' }} question</h2>
        <div class="mt-4 space-y-3">
          <AdminFormInput v-model="form.question" label="Question" />
          <AdminFormTextarea v-model="form.answer" label="Réponse" />
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
      title="Supprimer la question"
      message="Cette action est irréversible."
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
