<script setup lang="ts">
import { formatCurrency } from '~/utils/format'

usePageSeo({
  title: 'Merci pour votre don — PDS Humanity',
  description: 'Merci pour votre soutien à PDS Humanity.',
})

const route = useRoute()
const sessionId = computed(() => String(route.query.session_id ?? ''))

const loading = ref(true)
const paid = ref(false)
const amount = ref(0)
const alreadyRecorded = ref(false)

const anonymous = ref(false)
const username = ref('')
const message = ref('')
const submitting = ref(false)
const error = ref('')

onMounted(async () => {
  if (!sessionId.value) {
    navigateTo('/donate')
    return
  }
  try {
    const res = await $fetch<{ paid: boolean; amount: number; recorded: boolean }>(
      '/api/donation-session',
      { query: { session_id: sessionId.value } },
    )
    paid.value = res.paid
    amount.value = res.amount
    alreadyRecorded.value = res.recorded
    if (!res.paid) {
      navigateTo('/donate')
      return
    }
  } catch {
    error.value = 'Impossible de vérifier le paiement.'
  } finally {
    loading.value = false
  }
})

const finalize = async () => {
  submitting.value = true
  error.value = ''
  try {
    await $fetch('/api/donation-finalize', {
      method: 'POST',
      body: {
        session_id: sessionId.value,
        anonymous: anonymous.value,
        username: username.value,
        message: message.value,
      },
    })
    await navigateTo('/?merci=1')
  } catch (e: unknown) {
    error.value =
      (e as { data?: { statusMessage?: string } })?.data?.statusMessage ??
      'Une erreur est survenue. Réessayez.'
    submitting.value = false
  }
}
</script>

<template>
  <div class="home-container">
    <section class="mx-auto max-w-xl py-12 text-center md:py-16">
      <div v-if="loading" class="h-64 animate-pulse bg-white/10" />

      <div v-else v-reveal>
        <ChalkHeart class="chalk-picto mx-auto !h-12 !w-12" />
        <h1 class="section-title mt-4">Merci !</h1>
        <p class="accent-serif mt-3 text-lg">
          Votre don de
          <strong class="text-accent-green">{{ formatCurrency(amount) }}</strong>
          a bien été reçu.
        </p>

        <div v-if="alreadyRecorded" class="mt-10">
          <p class="text-white/70">Votre don a déjà été enregistré. Merci pour votre soutien !</p>
          <PrimaryButton to="/" class="mt-6">Retour à l'accueil</PrimaryButton>
        </div>

        <form v-else class="mt-10 space-y-4 text-left" @submit.prevent="finalize">
          <p class="text-center text-sm text-white/70">
            Souhaitez-vous laisser un message qui s'affichera lors de l'événement ?
          </p>

          <label class="flex items-center justify-center gap-2 text-sm text-white/80">
            <input v-model="anonymous" type="checkbox" class="rounded" />
            Rester anonyme (sans message)
          </label>

          <div v-if="!anonymous" class="space-y-4">
            <div>
              <label class="form-label">Pseudo</label>
              <input
                v-model="username"
                type="text"
                maxlength="40"
                placeholder="Votre pseudo (laisser vide = Anonyme)"
                class="input-field"
              />
            </div>
            <div>
              <label class="form-label">Message (optionnel)</label>
              <textarea
                v-model="message"
                rows="3"
                maxlength="300"
                placeholder="Un mot d'encouragement…"
                class="input-field"
              />
            </div>
          </div>

          <p v-if="error" class="text-sm text-accent-red">{{ error }}</p>

          <PrimaryButton type="submit" :disabled="submitting" class="w-full">
            {{ submitting ? 'Validation…' : 'Valider et revenir à l\'accueil' }}
          </PrimaryButton>
        </form>
      </div>
    </section>
  </div>
</template>
