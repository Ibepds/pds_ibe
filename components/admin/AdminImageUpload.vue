<script setup lang="ts">
const props = defineProps<{
  label: string
  currentUrl?: string
  storagePath: string
}>()

const emit = defineEmits<{ uploaded: [url: string] }>()

const { uploadImage, ready } = useAdminFirestore()
const uploading = ref(false)
const error = ref<string | null>(null)
const preview = ref(props.currentUrl ?? '')

watch(() => props.currentUrl, (v) => {
  if (v) preview.value = v
})

const onFile = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  error.value = null
  try {
    // Chemin unique par fichier pour éviter d'écraser les uploads précédents
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const uniquePath = `${props.storagePath}/${Date.now()}-${safeName}`
    const url = await uploadImage(uniquePath, file)
    preview.value = url
    emit('uploaded', url)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Erreur upload'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div>
    <span class="mb-1 block text-sm font-medium text-gray-700">{{ label }}</span>
    <div
      v-if="preview"
      class="mb-3 h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
    >
      <img :src="preview" alt="Aperçu" width="96" height="96" loading="lazy" decoding="async" class="h-full w-full object-cover">
    </div>
    <input
      type="file"
      accept="image/*"
      class="text-sm text-gray-600"
      :disabled="!ready || uploading"
      @change="onFile"
    >
    <p v-if="!ready" class="mt-1 text-xs text-amber-600">
      Firebase requis pour l'upload
    </p>
    <p v-if="uploading" class="mt-1 text-xs text-gray-500">Upload en cours...</p>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
