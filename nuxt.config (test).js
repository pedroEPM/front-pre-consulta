import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s',
    title: 'Megateca',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  router: {
    //base: '/centro-consulta/'
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
   plugins: [
    { src: '~/plugins/chart.js', mode: 'client' },
    { src : '~/plugins/vue-zoomer.js' },
    { src: '~/plugins/vue-pdf-app.js', mode: 'client' },
    { src: '@/plugins/vue-html2pdf', mode: 'client' }

  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'https://megateca.megamedia.com.mx/cc2'//'http://192.168.7.195:3002/v1'//'https://megateca.megamedia.com.mx/cc'//'http://192.168.7.195:3002/v1' // 'https://dev-axon.com/cc',
  },

  env: {
    imgPath: 'https://megateca.megamedia.com.mx/img',//'http://192.168.7.197',//'https://megateca.megamedia.com.mx/img',//'
    errorImagePath : '/ImageNotFoundByMegaMedia.jpg',
    workingPath : '/WorkingImageMegamedia.jpg',
    defaultImg : '/CatalogImageDefault.png'
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: '#001689',
          accent: '#1697F6',
          secondary: '#1867C0',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#1E2899',
          accent: '#024CBC',
          secondary: '#024CBC',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  server :  {
	port:3004
  },
  router: {
      base: '/test-consulta/'
    },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    router: {
      base: '/pre-consulta/'
    },
  },
}
