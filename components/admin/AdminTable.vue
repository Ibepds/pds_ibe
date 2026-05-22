<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string }[]
  rows: Record<string, unknown>[]
  loading?: boolean
}>()

defineEmits<{ edit: [row: Record<string, unknown>]; delete: [row: Record<string, unknown>] }>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
    <table class="min-w-full text-left text-sm">
      <thead class="border-b border-gray-200 bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 font-semibold text-gray-600"
          >
            {{ col.label }}
          </th>
          <th class="px-4 py-3 font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + 1" class="px-4 py-8 text-center text-gray-400">
            Chargement...
          </td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="columns.length + 1" class="px-4 py-8 text-center text-gray-400">
            Aucune donnée
          </td>
        </tr>
        <tr
          v-for="(row, idx) in rows"
          v-else
          :key="String(row.id ?? idx)"
          class="border-b border-gray-100 hover:bg-gray-50"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-gray-800"
          >
            {{ row[col.key] }}
          </td>
          <td class="px-4 py-3">
            <button
              class="mr-2 text-primary hover:underline"
              @click="$emit('edit', row)"
            >
              Modifier
            </button>
            <button
              class="text-red-600 hover:underline"
              @click="$emit('delete', row)"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
