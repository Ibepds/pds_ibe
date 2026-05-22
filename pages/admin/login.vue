<script setup lang="ts">
definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const { login, error, loading, isAdmin, user } = useAuth()
const submitting = ref(false)

watch([user, isAdmin, loading], () => {
  if (!loading.value && user.value && isAdmin.value) {
    navigateTo('/admin')
  }
})

const onSubmit = async () => {
  submitting.value = true
  const ok = await login(email.value, password.value)
  submitting.value = false
  if (ok) navigateTo('/admin')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <form
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-2xl font-bold text-gray-900">Administration Ibé PDS</h1>
      <p class="mt-2 text-sm text-gray-500">Connexion réservée aux administrateurs</p>

      <div class="mt-6 space-y-4">
        <AdminFormInput v-model="email" label="Email" type="email" required />
        <AdminFormInput v-model="password" label="Mot de passe" type="password" required />
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        class="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        :disabled="submitting"
      >
        {{ submitting ? 'Connexion...' : 'Se connecter' }}
      </button>

      <NuxtLink to="/" class="mt-4 block text-center text-sm text-gray-500 hover:text-primary">
        ← Retour au site public
      </NuxtLink>
    </form>
  </div>
</template>
