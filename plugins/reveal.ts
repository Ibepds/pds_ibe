// Directive v-reveal : anime l'apparition d'un élément quand il entre dans l'écran.
// Usage : v-reveal (simple) ou v-reveal="200" (délai en ms).
// Enregistrée universellement (évite le warning SSR) ; la logique ne s'exécute
// que côté client dans le hook mounted.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (!import.meta.client) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      el.classList.add('reveal')
      if (typeof binding.value === 'number') {
        el.style.transitionDelay = `${binding.value}ms`
      }

      // Déjà visible au chargement ? -> on révèle tout de suite (pas de flash)
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        el.classList.add('is-visible')
        return
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add('is-visible')
              io.unobserve(el)
            }
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
      )
      io.observe(el)
    },
  })
})
