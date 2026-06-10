<script setup lang="ts">
import { MOCK_FAQ } from '~/utils/mockData'

const { data: faq, loading, error } = useFirestoreCollection('faq', MOCK_FAQ, {
  orderField: 'order',
  orderDirection: 'asc',
})

usePageBackground('white')

usePageSeo({
  title: 'FAQ — PDS Humanity',
  description:
    'Toutes les réponses sur PDS Humanity : dons, freestyles, enchères, plateformes de diffusion et participation à l\'événement caritatif.',
})
</script>

<template>
  <div class="py-12">
    <FaqSection :items="faq" :loading="loading" />
    <p v-if="error" class="text-center text-accent-rose">{{ error }}</p>
  </div>
</template>
