<script setup lang="ts">
import { MOCK_FAQ } from '~/utils/mockData'

const { data: faq, loading, error } = useFirestoreCollection('faq', MOCK_FAQ, {
  orderField: 'order',
  orderDirection: 'asc',
})

usePageSeo({
  title: 'FAQ — PDS Humanity',
  description:
    'Toutes les réponses sur PDS Humanity : dons, freestyles, enchères, plateformes de diffusion et participation à l\'événement caritatif.',
})
</script>

<template>
  <div class="home-container">
    <FaqSection v-reveal :items="faq" :loading="loading" :show-link="false" />
    <p v-if="error" class="pb-12 text-center text-accent-rose">{{ error }}</p>
  </div>
</template>
