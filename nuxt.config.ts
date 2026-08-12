// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      meta: [{ name: 'theme-color', content: '#173c31' }],
      link: [{ rel: 'icon', href: '/favicon.ico' }]
    }
  }
})
