<script setup lang="ts">
import { MOCK_EVENT } from '~/utils/mockData'
import { formatCurrency } from '~/utils/format'

const { event, loading } = useEvent()

definePageMeta({ pageBackground: 'blue' })

usePageSeo({
  title: 'Faire un don — PDS Humanity',
  description:
    'Soutenez PDS Humanity : faites un don en ligne sécurisé. 100% des fonds récoltés sont reversés aux associations partenaires.',
})

const email = ref('')
const submitting = ref(false)
const error = ref('')

const startCheckout = async () => {
  error.value = ''
  if (!email.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
    error.value = 'Veuillez saisir une adresse e-mail valide.'
    return
  }
  submitting.value = true
  try {
    const { url } = await $fetch<{ url: string }>('/api/checkout', {
      method: 'POST',
      body: { email: email.value },
    })
    if (url) window.location.href = url
    else throw new Error('Réponse invalide')
  } catch (e: unknown) {
    error.value =
      (e as { data?: { statusMessage?: string } })?.data?.statusMessage ??
      'Impossible de démarrer le paiement. Réessayez plus tard.'
    submitting.value = false
  }
}
</script>

<template>
  <div class="py-20 md:py-28">
    <div class="mx-auto max-w-2xl px-4 text-center lg:px-8">
      <h1 class="section-title gradient-text">Faire un don</h1>
      <p class="accent-serif mt-4 text-lg text-white/75 md:text-xl">
        Chaque contribution compte — 100% reversé aux associations partenaires.
      </p>

      <div v-if="loading" class="mt-10 card-glow h-48 animate-pulse" />
      <div v-else class="mt-10 card-glow p-8 text-left">
        <div class="text-center">
          <p class="text-sm uppercase tracking-wide text-white/60">Montant collecté</p>
          <p class="mt-2 font-display text-4xl font-bold text-accent-green">
            {{ formatCurrency(event?.currentAmount ?? MOCK_EVENT.currentAmount) }}
          </p>
          <p class="mt-1 text-sm text-white/60">
            Objectif : {{ formatCurrency(event?.donationGoal ?? MOCK_EVENT.donationGoal) }}
          </p>
        </div>

        <form class="mt-8 space-y-4" @submit.prevent="startCheckout">
          <div>
            <label class="mb-1 block text-sm font-medium text-white/80">
              Votre e-mail <span class="text-accent-rose">*</span>
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="vous@email.com"
              class="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
            />
            <p class="mt-1 text-xs text-white/50">
              Vous choisirez le montant de votre don sur la page de paiement sécurisée.
            </p>
          </div>

          <p v-if="error" class="text-sm text-accent-rose">{{ error }}</p>

          <PrimaryButton type="submit" :disabled="submitting" class="w-full">
            {{ submitting ? 'Redirection…' : 'Continuer vers le paiement' }}
          </PrimaryButton>
        </form>

        <p class="mt-4 text-center text-xs text-white/50">
          Paiement sécurisé par Stripe. Vous reviendrez ensuite sur le site.
        </p>
      </div>
    </div>
  </div>
</template>
