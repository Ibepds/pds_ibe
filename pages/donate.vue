<script setup lang="ts">
import { MOCK_EVENT } from '~/utils/mockData'
import { formatCurrency, formatCurrencyPrecise, getProgressPercent } from '~/utils/format'
import { coverFeeCents } from '~/utils/fees'

const { event, loading } = useEvent()

usePageSeo({
  title: 'Faire un don — PDS Humanity',
  description:
    'Soutenez PDS Humanity : faites un don en ligne sécurisé. 100% des fonds récoltés sont reversés aux associations partenaires.',
})

const email = ref('')
const submitting = ref(false)
const error = ref('')

// Choix du montant — montant confirmé uniquement (presets ou champ libre validé)
const PRESETS = [10, 20, 50, 100]
const amount = ref(20)
const customActive = ref(false)
const custom = ref('')
const customError = ref('')

const pickPreset = (v: number) => {
  amount.value = v
  customActive.value = false
  custom.value = ''
  customError.value = ''
}

const validateCustom = () => {
  const v = parseFloat(String(custom.value).trim().replace(',', '.'))
  if (!Number.isFinite(v) || v < 1) {
    customError.value = 'Montant invalide (minimum 1 €).'
    return
  }
  if (v > 10000) {
    customError.value = 'Montant maximum : 10 000 €.'
    return
  }
  amount.value = Math.round(v * 100) / 100
  customActive.value = true
  customError.value = ''
}

// Couverture des frais (pré-cochée : c'est le plus avantageux pour la cause)
const coverFees = ref(true)

const feeEuros = computed(() => coverFeeCents(Math.round(amount.value * 100)) / 100)
const total = computed(() => amount.value + (coverFees.value ? feeEuros.value : 0))

const { total: donationsTotal } = useDonationsLive()
const current = computed(() => donationsTotal.value)
const goal = computed(() => event.value?.donationGoal ?? MOCK_EVENT.donationGoal)
const progress = computed(() => getProgressPercent(current.value, goal.value))

const startCheckout = async () => {
  error.value = ''
  if (!email.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
    error.value = 'Veuillez saisir une adresse e-mail valide.'
    return
  }
  if (amount.value < 1) {
    error.value = 'Veuillez choisir un montant d’au moins 1 €.'
    return
  }
  submitting.value = true
  try {
    const { url } = await $fetch<{ url: string }>('/api/checkout', {
      method: 'POST',
      body: { email: email.value, amount: amount.value, coverFees: coverFees.value },
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
        <p class="font-display text-3xl font-bold uppercase md:text-4xl">
          {{ formatCurrency(current) }}
          <span class="text-white/45"> / {{ formatCurrency(goal) }}</span>
        </p>
        <div class="progress-chalk mt-6">
          <div class="progress-chalk-fill" :style="{ width: `${progress}%` }" />
        </div>
        <p class="mt-4 text-sm font-semibold uppercase tracking-wide text-primary-light">
          {{ progress }}% de l'objectif atteint
        </p>

        <form class="mt-10 space-y-6 text-left" @submit.prevent="startCheckout">
          <!-- Montant -->
          <div>
            <label class="form-label">Montant du don <span class="text-accent-red">*</span></label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="p in PRESETS"
                :key="p"
                type="button"
                class="chip"
                :class="amount === p && !customActive ? 'chip-active' : 'chip-idle'"
                @click="pickPreset(p)"
              >
                {{ p }} €
              </button>
            </div>
            <div class="mt-3 flex gap-2">
              <div class="relative flex-1">
                <input
                  v-model="custom"
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  inputmode="decimal"
                  placeholder="Autre montant"
                  class="input-field pr-8"
                  :class="customActive ? 'border-primary-light ring-2 ring-primary-light/40' : ''"
                  @keydown.enter.prevent="validateCustom"
                />
                <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
              </div>
              <button type="button" class="btn-primary shrink-0 !px-5" @click="validateCustom">
                Valider
              </button>
            </div>
            <p v-if="customError" class="mt-2 text-xs text-accent-red">{{ customError }}</p>
            <p v-else-if="customActive" class="mt-2 text-xs font-semibold text-accent-green">
              Montant choisi : {{ formatCurrencyPrecise(amount) }}
            </p>
          </div>

          <!-- Couvrir les frais -->
          <label
            class="flex cursor-pointer items-start gap-3 border-2 border-white/35 bg-white/5 p-4 transition hover:bg-white/10"
          >
            <input v-model="coverFees" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 rounded" />
            <span class="text-sm text-white/85">
              <span class="font-semibold text-white">
                J'ajoute {{ formatCurrencyPrecise(feeEuros) }} pour couvrir les frais
              </span>
              <span class="mt-1 block text-white/60">
                Ainsi <strong class="text-white">100 % de mon don</strong> va à la cause (les frais
                de transaction bancaire sont pris en charge).
              </span>
            </span>
          </label>

          <!-- E-mail -->
          <div>
            <label class="form-label">
              Votre e-mail <span class="text-accent-red">*</span>
            </label>
            <input
              v-model="email"
              type="email"
              required
              maxlength="200"
              placeholder="vous@email.com"
              class="input-field"
            />
            <p class="form-hint">Pour votre reçu et le suivi de votre don.</p>
          </div>

          <!-- Récapitulatif -->
          <div class="flex items-center justify-between border-t border-white/15 pt-4 text-sm">
            <span class="text-white/70">Total débité</span>
            <span class="font-display text-2xl font-bold text-accent-green">
              {{ formatCurrencyPrecise(total) }}
            </span>
          </div>

          <p v-if="error" class="text-sm text-accent-red">{{ error }}</p>

          <PrimaryButton type="submit" :disabled="submitting" class="w-full">
            <ChalkHeart />
            {{ submitting ? 'Redirection…' : `Donner ${formatCurrencyPrecise(total)}` }}
          </PrimaryButton>
        </form>

        <p class="mt-4 text-center text-xs text-white/50">
          Paiement sécurisé par Stripe. Vous reviendrez ensuite sur le site.
        </p>
      </div>
    </section>
  </div>
</template>
