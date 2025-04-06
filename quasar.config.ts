// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file
import { defineConfig } from '#q-app/wrappers';
import { templateCompilerOptions } from '@tresjs/core';
import { fileURLToPath } from 'node:url';

export default defineConfig((ctx) => {
  return {
    // path alias
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['i18n'],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },

      typescript: {
        strict: true,
        vueShim: true
        // extendTsConfig (tsConfig) {}
      },

      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            include: [fileURLToPath(new URL('./src/i18n', import.meta.url))],
            ssr: ctx.modeName === 'ssr'
          }
        ],

        [
          'vite-plugin-checker',
          {
            eslint: {
              lintCommand:
                'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true
            },
            vueTsc: true
          },
          { server: false }
        ]
      ],

      viteVuePluginOptions: {
        ...templateCompilerOptions,
        runtimeOnly: false,
        template: {
          compilerOptions: {
            // necessary for vue-i18n interpolation in templates
            ...templateCompilerOptions.template?.compilerOptions
          }
        }
      },

      vueRouterMode: 'hash' // available values: 'hash', 'history'
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: ['app.scss'],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      // https: true,
      open: true // opens browser window automatically
    },

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {},
      // Quasar plugins
      plugins: []
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      middlewares: [
        'render' // keep this as last one
      ],
      prodPort: 3000, // The default port that the production server should use
      pwa: false
    }
  };
});
