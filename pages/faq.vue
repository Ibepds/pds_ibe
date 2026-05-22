<script setup lang="ts">
import { MOCK_FAQ } from '~/utils/mockData'

const { data: faq, loading, error } = useFirestoreCollection('faq', MOCK_FAQ, {
  orderField: 'order',
  orderDirection: 'asc',
})
</script>

<template>
  <div class="py-12">
    <FaqSection :items="faq" :loading="loading" />
    <p v-if="error" class="text-center text-accent-rose">{{ error }}</p>
  </div>
</template>
