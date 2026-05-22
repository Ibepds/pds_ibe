<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
}>()

defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        <p class="mt-2 text-gray-600">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
            @click="$emit('cancel')"
          >
            Annuler
          </button>
          <button
            class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            @click="$emit('confirm')"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
