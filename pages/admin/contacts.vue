<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { ContactMessage } from '~/types'
import { MOCK_CONTACTS } from '~/utils/mockData'

// Adresse de l'équipe qui traite les demandes de contact
const TEAM_EMAIL = 'alizee.grosjean@pdsrecords.com'

const { data: contacts, loading, refresh } = useFirestoreCollection(
  'contacts',
  MOCK_CONTACTS,
  { orderField: 'createdAt', orderDirection: 'desc' },
)
const { remove } = useAdminFirestore()

const feedback = ref('')
const deleteTarget = ref<ContactMessage | null>(null)

const fmtDate = (v: unknown) => {
  if (!v) return ''
  const d = (v as { toDate?: () => Date })?.toDate
    ? (v as { toDate: () => Date }).toDate()
    : new Date(v as string)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR')
}

const replyLink = (c: ContactMessage) => {
  const subject = encodeURIComponent(`Re: ${c.subject || 'Votre message'} — PDS Humanity`)
  const body = encodeURIComponent(
    `\n\n―――――\nLe ${fmtDate(c.createdAt)}, ${c.name} a écrit :\n${c.message}`,
  )
  return `mailto:${c.email}?subject=${subject}&body=${body}`
}

const confirmDelete = async () => {
  if (!deleteTarget.value?.id) return
  try {
    await remove('contacts', deleteTarget.value.id)
    feedback.value = 'Message supprimé.'
    deleteTarget.value = null
    await refresh()
  } catch (e: unknown) {
    feedback.value = e instanceof Error ? e.message : 'Erreur'
  }
}
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">Messages de contact</h1>
      <span class="text-sm text-gray-500">{{ contacts.length }} message(s)</span>
    </div>
    <p class="mb-6 max-w-2xl text-sm text-gray-500">
      Les messages envoyés via le formulaire de contact arrivent ici. Utilisez « Répondre » pour
      ouvrir votre messagerie. Référent : <span class="text-gray-700">{{ TEAM_EMAIL }}</span>.
    </p>

    <p v-if="feedback" class="mb-4 text-sm text-green-700">{{ feedback }}</p>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="h-28 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div v-else-if="contacts.length === 0" class="rounded-lg border border-dashed p-8 text-center text-gray-400">
      Aucun message pour le moment.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="c in contacts"
        :key="c.id"
        class="rounded-lg border bg-white p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold text-gray-900">{{ c.name }}</span>
              <span v-if="c.subject" class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {{ c.subject }}
              </span>
            </div>
            <a :href="`mailto:${c.email}`" class="text-sm text-blue-600 hover:underline">{{ c.email }}</a>
            <p class="mt-2 whitespace-pre-line text-sm text-gray-700">{{ c.message }}</p>
            <p class="mt-2 text-xs text-gray-400">{{ fmtDate(c.createdAt) }}</p>
          </div>
          <div class="flex flex-shrink-0 gap-2">
            <a
              :href="replyLink(c)"
              class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
            >
              Répondre
            </a>
            <button
              class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              @click="deleteTarget = c"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <AdminConfirmModal
      :open="!!deleteTarget"
      title="Supprimer le message"
      message="Cette action est irréversible."
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
