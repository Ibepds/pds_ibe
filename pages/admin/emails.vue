<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

// Suivi des e-mails envoyés par l'extension "Trigger Email from Firestore".
// Lit la collection `mail` et affiche le champ `delivery` écrit par l'extension.

interface MailDoc {
  id: string
  to?: string
  replyTo?: string
  message?: { subject?: string }
  createdAt?: unknown
  delivery?: {
    state?: string
    error?: string
    attempts?: number
    startTime?: unknown
    endTime?: unknown
    info?: { messageId?: string; accepted?: string[]; rejected?: string[] }
  }
}

const { data: mails, loading, refresh } = useFirestoreCollection<MailDoc>(
  'mail',
  [],
  { orderField: 'createdAt', orderDirection: 'desc' },
)

const fmtDate = (v: unknown) => {
  if (!v) return ''
  const d = (v as { toDate?: () => Date })?.toDate
    ? (v as { toDate: () => Date }).toDate()
    : new Date(v as string)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR')
}

const stateClass = (state?: string) => {
  switch (state) {
    case 'SUCCESS':
      return 'bg-green-100 text-green-800'
    case 'ERROR':
      return 'bg-red-100 text-red-800'
    case 'PROCESSING':
    case 'PENDING':
    case 'RETRY':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const stats = computed(() => ({
  total: mails.value.length,
  success: mails.value.filter((m) => m.delivery?.state === 'SUCCESS').length,
  error: mails.value.filter((m) => m.delivery?.state === 'ERROR').length,
  pending: mails.value.filter(
    (m) => m.delivery && ['PENDING', 'PROCESSING', 'RETRY'].includes(m.delivery.state ?? ''),
  ).length,
  untreated: mails.value.filter((m) => !m.delivery).length,
}))
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">Suivi des e-mails</h1>
      <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50" @click="refresh">
        Rafraîchir
      </button>
    </div>
    <p class="mb-4 max-w-2xl text-sm text-gray-500">
      État d'envoi des e-mails traités par l'extension « Trigger Email from Firestore »
      (collection <code>mail</code>). Si la liste est vide, aucun e-mail n'a encore été déclenché.
    </p>

    <div
      v-if="stats.untreated > 0"
      class="mb-6 max-w-2xl rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800"
    >
      <strong>{{ stats.untreated }} e-mail(s) « NON TRAITÉ »</strong> (sans champ
      <code>delivery</code>) : l'extension ne les a pas pris en charge. Causes probables :
      l'extension n'est pas encore active, surveille une autre collection que <code>mail</code>,
      ou ces documents ont été créés <em>avant</em> son installation. Envoyez un nouveau test
      une fois l'extension active.
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
        <p class="text-xs text-gray-500">Total</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-green-600">{{ stats.success }}</p>
        <p class="text-xs text-gray-500">Envoyés</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
        <p class="text-xs text-gray-500">En attente</p>
      </div>
      <div class="rounded-lg border bg-white p-4 text-center">
        <p class="text-2xl font-bold text-red-600">{{ stats.error }}</p>
        <p class="text-xs text-gray-500">Erreurs</p>
      </div>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="h-20 animate-pulse rounded-lg bg-gray-100" />
    </div>

    <div v-else-if="mails.length === 0" class="rounded-lg border border-dashed p-8 text-center text-gray-400">
      Aucun e-mail dans la file. Vérifiez que l'extension est installée et envoyez un message de test.
    </div>

    <div v-else class="space-y-3">
      <div v-for="m in mails" :key="m.id" class="rounded-lg border bg-white p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="m.delivery ? stateClass(m.delivery.state) : 'bg-orange-100 text-orange-800'"
              >
                {{ m.delivery?.state ?? 'NON TRAITÉ' }}
              </span>
              <span class="font-medium text-gray-900">{{ m.message?.subject ?? '(sans objet)' }}</span>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Vers : {{ m.to }}<span v-if="m.replyTo"> · Réponse : {{ m.replyTo }}</span>
            </p>
            <p v-if="m.delivery?.error" class="mt-1 text-sm text-red-600">
              Erreur : {{ m.delivery.error }}
            </p>
            <p v-if="m.delivery?.info?.messageId" class="mt-1 text-xs text-gray-400">
              ID message : {{ m.delivery.info.messageId }}
            </p>
            <p class="mt-1 text-xs text-gray-400">
              Créé : {{ fmtDate(m.createdAt) }}
              <span v-if="m.delivery?.endTime"> · Envoyé : {{ fmtDate(m.delivery.endTime) }}</span>
              <span v-if="m.delivery?.attempts"> · Tentatives : {{ m.delivery.attempts }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
