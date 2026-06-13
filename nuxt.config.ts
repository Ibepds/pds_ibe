// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Privé (serveur uniquement) — surchargé par NUXT_STRIPE_SECRET_KEY etc.
    stripeSecretKey: '',
    firebaseServiceAccount: '', // JSON du compte de service Firebase (une ligne)
    public: {
      siteUrl: 'https://pdshumanity.com',
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
    },
  },
  routeRules: {
    '/admin/**': { ssr: false },
  },
  app: {
    head: {
      title: 'PDS Humanity — Musique & Solidarité',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0546A0' },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'PDS Records / Ibé' },
        {
          name: 'description',
          content:
            'PDS Humanity — Marathon caritatif de 24h organisé par PDS Records / Ibé. Musique, solidarité et dons en direct les 27 et 28 juin.',
        },
        // Open Graph
        { property: 'og:site_name', content: 'PDS Humanity' },
        { property: 'og:title', content: 'PDS Humanity — Musique & Solidarité' },
        {
          property: 'og:description',
          content:
            'Marathon caritatif de 24h organisé par PDS Records / Ibé. Performances musicales, freestyles, enchères solidaires — 27 & 28 juin.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:url', content: 'https://pdshumanity.fr' },
        { property: 'og:image', content: 'https://pdshumanity.fr/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'PDS Humanity — Musique & Solidarité' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'PDS Humanity — Musique & Solidarité' },
        {
          name: 'twitter:description',
          content:
            'Marathon caritatif de 24h organisé par PDS Records / Ibé — 27 & 28 juin.',
        },
        { name: 'twitter:image', content: 'https://pdshumanity.fr/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        // Polices : preconnect + chargement non bloquant (plus rapide que @import CSS)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
