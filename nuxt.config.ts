// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
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
        {
          name: 'description',
          content:
            'PDS Humanity — Marathon caritatif de 24h organisé par PDS Records / Ibé. Musique, solidarité et dons en direct les 27 et 28 juin.',
        },
        { property: 'og:title', content: 'PDS Humanity — Musique & Solidarité' },
        {
          property: 'og:description',
          content:
            'Marathon caritatif de 24h organisé par PDS Records / Ibé. Performances musicales, freestyles, enchères solidaires — 27 & 28 juin.',
        },
        { property: 'og:type', content: 'website' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
