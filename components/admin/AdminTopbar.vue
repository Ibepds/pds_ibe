<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
    <slot name="title">
      <h1 class="text-lg font-semibold text-gray-900">Administration</h1>
    </slot>
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-500">{{ user?.email }}</span>
      <button
        class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        @click="logout"
      >
        Déconnexion
      </button>
    </div>
  </header>
</template>
