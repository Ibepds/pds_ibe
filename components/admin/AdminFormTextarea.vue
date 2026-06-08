<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  rows?: number
  placeholder?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</span>
    <textarea
      :value="modelValue"
      :rows="rows ?? 4"
      :placeholder="placeholder"
      class="input-field resize-y"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </label>
</template>
