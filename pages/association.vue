<script setup lang="ts">
import { MOCK_ASSOCIATION } from '~/utils/mockData'

const { single: association, loading, error } = useFirestoreCollection(
  'association',
  [{ id: 'main', ...MOCK_ASSOCIATION }],
  { docId: 'main' },
)
</script>

<template>
  <div class="py-12">
    <AssociationSection :association="association" :loading="loading" />
    <p v-if="error" class="text-center text-accent-rose">{{ error }}</p>
  </div>
</template>
