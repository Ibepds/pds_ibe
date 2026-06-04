export default defineNuxtRouteMiddleware(async () => {
  const { user, isAdmin, loading } = useAuth()

  if (import.meta.server) return

  if (loading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(loading, (isLoading) => {
        if (!isLoading) {
          stop()
          resolve()
        }
      })
    })
  }

  if (!user.value || !isAdmin.value) {
    return navigateTo('/admin/login')
  }
})
