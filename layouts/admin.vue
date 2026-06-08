<script setup lang="ts">
// L'espace d'administration ne doit jamais être indexé par les moteurs.
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <AdminLayout>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <slot />
  </AdminLayout>
</template>
