import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  resolve: {
    alias: {
      '@ROOT/': `${path.resolve(__dirname)}/`,
      '@SRC/': `${path.resolve(__dirname, 'src')}/`,
      '@GLOBAL/': `${path.resolve(__dirname, 'src/global')}/`,
      '@FEATURES/': `${path.resolve(__dirname, 'src/features')}/`,
      '@API/': `${path.resolve(__dirname, 'src/api')}/`,
      // hotfix until the following PR is merged: https://github.com/developit/unfetch/pull/164
      unfetch: path.resolve(__dirname, 'node_modules/unfetch/dist/unfetch.mjs'),
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue'],
      pagesDir: [{ dir: 'src/features/**/router-views', baseRoute: '' }],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({
      defaultLayout: 'DefaultLayout',
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      dts: 'src/generated_auto-imports.d.ts',
      imports: ['@vueuse/core', '@vueuse/head', 'vitest', 'vue', 'vue-i18n', 'vue-router'],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // search for subdirectories
      deep: true,
      // Allow subdirectories as namespace prefix for components.
      directoryAsNamespace: true,
      // output
      dts: 'src/generated_global_components.d.ts',
      // targeting (== which files will be considered as components)
      globs: ['src/global/components/**/*.vue'],
      // allow auto import
      include: [/\.vue$/, /\.vue\?vue/],
      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
    }),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
      manifest: {
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        name: 'Vista',
        short_name: 'Vista',
        theme_color: '#ffffff',
      },
      registerType: 'autoUpdate',
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
      runtimeOnly: false,
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
  ],

  server: {
    hmr: {
      // port: 3334,
    },
    fs: {
      strict: true,
    },
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    formatting: 'minify',
    script: 'async',
  },

  optimizeDeps: {
    exclude: ['vue-demi'],
    include: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
  },

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },
})
