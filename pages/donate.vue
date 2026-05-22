<script setup lang="ts">
import { MOCK_EVENT } from '~/utils/mockData'
import { formatCurrency } from '~/utils/format'

const { event, loading } = useEvent()
</script>

<template>
  <div class="py-12">
    <div class="mx-auto max-w-2xl px-4 text-center lg:px-8">
      <h1 class="section-title gradient-text">Faire un don</h1>
      <p class="mt-4 text-gray-300">
        Chaque contribution compte. Organisé par Ibé PDS au profit de notre association partenaire.
      </p>

      <div v-if="loading" class="mt-10 card-glow h-48 animate-pulse" />
      <div v-else class="mt-10 card-glow p-8">
        <p class="text-sm text-gray-400">Montant collecté</p>
        <p class="mt-2 font-display text-4xl font-bold text-accent-green">
          {{ formatCurrency(event?.currentAmount ?? MOCK_EVENT.currentAmount) }}
        </p>
        <p class="mt-2 text-gray-400">
          Objectif : {{ formatCurrency(event?.donationGoal ?? MOCK_EVENT.donationGoal) }}
        </p>
        <PrimaryButton
          :href="event?.donationUrl ?? MOCK_EVENT.donationUrl"
          external
          class="mt-8 w-full"
        >
          Donner via HelloAsso
        </PrimaryButton>
        <p class="mt-4 text-xs text-gray-500">
          Paiement sécurisé via notre plateforme partenaire. Reçu fiscal selon éligibilité de l'association.
        </p>
      </div>
    </div>
  </div>
</template>
