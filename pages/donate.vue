<script setup lang="ts">
import { MOCK_EVENT } from '~/utils/mockData'
import { formatCurrency, getProgressPercent } from '~/utils/format'

const { event, loading } = useEvent()

usePageSeo({
  title: 'Faire un don — PDS Humanity',
  description:
    'Soutenez PDS Humanity : faites un don en ligne sécurisé. 100% des fonds récoltés sont reversés aux associations partenaires.',
})

const email = ref('')
const submitting = ref(false)
const error = ref('')

const current = computed(() => event.value?.currentAmount ?? MOCK_EVENT.currentAmount)
const goal = computed(() => event.value?.donationGoal ?? MOCK_EVENT.donationGoal)
const progress = computed(() => getProgressPercent(current.value, goal.value))

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
  <div class="home-container">
    <section class="py-12 text-center md:py-16">
      <PageHeader
        align="center"
        title="Faire un don"
        lead="Chaque contribution compte — 100% reversé aux associations partenaires."
      />
    </section>

    <section class="section-divider mx-auto max-w-xl py-12 md:py-16">
      <div v-if="loading" class="h-48 animate-pulse bg-white/10" />
      <div v-else v-reveal>
        <p class="font-display text-2xl font-bold uppercase sm:text-3xl md:text-4xl">
          {{ formatCurrency(current) }}
          <span class="text-white/45"> / {{ formatCurrency(goal) }}</span>
        </p>
        <div class="progress-chalk mt-6">
          <div class="progress-chalk-fill" :style="{ width: `${progress}%` }" />
        </div>
        <p class="mt-4 text-sm font-semibold uppercase tracking-wide text-primary-light">
          {{ progress }}% de l'objectif atteint
        </p>

        <form class="mt-10 space-y-4 text-left" @submit.prevent="startCheckout">
          <div>
            <label class="form-label">
              Votre e-mail <span class="text-accent-red">*</span>
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="vous@email.com"
              class="input-field"
            />
            <p class="form-hint">
              Vous choisirez le montant de votre don sur la page de paiement sécurisée.
            </p>
          </div>

          <p v-if="error" class="text-sm text-accent-red">{{ error }}</p>

          <PrimaryButton type="submit" :disabled="submitting" class="w-full">
            <ChalkHeart />
            {{ submitting ? 'Redirection…' : 'Continuer vers le paiement' }}
          </PrimaryButton>
        </form>

        <p class="mt-4 text-center text-xs text-white/50">
          Paiement sécurisé par Stripe. Vous reviendrez ensuite sur le site.
        </p>
      </div>
    </section>
  </div>
</template>
