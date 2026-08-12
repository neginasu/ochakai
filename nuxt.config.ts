// https://nuxt.com/docs/api/configuration/nuxt-config
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL,
    head: {
      meta: [{ name: 'theme-color', content: '#173c31' }],
      link: [{ rel: 'icon', href: `${baseURL}favicon.ico` }]
    }
  }
})
