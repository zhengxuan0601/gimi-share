export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'GimiShare-分享新鲜事',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '记录身边趣事，与您共同分享' },
      { hid: 'keywords', name: 'keywords', content: 'GimShare,生活分享,学习,指南' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'referrer', content: 'no-referrer' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_3367936_by3kr73satr.css' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'ant-design-vue/dist/antd.css',
    'mavon-editor/dist/css/index.css',
    '~/assets/style/common.css'
  ],

  styleResources: {
    less: '~/assets/style/common.less'
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/antd-ui',
    '~/plugins/axios',
    {
      src: '@/plugins/mavon-editor',
      ssr: false
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    prefix: '/gimishare',
    proxy: true
  },

  proxy: {
    '/gimishare': {
      target: "http://localhost:5555/gimishare", // 代理地址
      changeOrigin: true,
      pathRewrite: {
        '^/gimishare': ''
      },
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  loading: {
    color: '#42b983'
  }
}
