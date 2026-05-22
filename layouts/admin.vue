<template>
  <AdminLayout>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <slot />
  </AdminLayout>
</template>
