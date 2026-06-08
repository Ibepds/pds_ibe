<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string | number | undefined
  type?: string
  placeholder?: string
  required?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string | number] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</span>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      class="input-field"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </label>
</template>
