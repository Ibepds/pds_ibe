export default defineNuxtRouteMiddleware(async () => {
  const { user, isAdmin, loading } = useAuth()

  if (import.meta.server) return

  await new Promise<void>((resolve) => {
    const stop = watch(
      loading,
      (isLoading) => {
        if (!isLoading) {
          stop()
          resolve()
        }
      },
      { immediate: true },
    )
  })

  if (!user.value || !isAdmin.value) {
    return navigateTo('/admin/login')
  }
})
