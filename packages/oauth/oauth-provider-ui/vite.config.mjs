import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lingui } from '@lingui/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { bundleManifest } from '@atproto-labs/rollup-plugin-bundle-manifest'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '#': resolve(__dirname, './src'),
    },
    conditions: ['browser', 'import', 'module', 'default'],
  },
  plugins: [
    react({
      plugins: [['@lingui/swc-plugin', {}]],
    }),
    lingui(),
    tailwindcss(),
  ],
  // Assets (e.g. the self-hosted brand fonts referenced via url() in
  // style.css) are served by the custom assets-manifest middleware under
  // this prefix, not from the site root — see
  // packages/oauth/oauth-provider/src/router/assets/assets-manifest.ts.
  // Only affects build output, not the `dev:ui` dev server.
  experimental: {
    renderBuiltUrl(filename) {
      return `/@atproto/oauth-provider/~assets/${filename}`
    },
  },
  build: {
    emptyOutDir: false,
    outDir: './dist',
    sourcemap: true,
    rollupOptions: {
      input: [
        './src/account-page.tsx',
        './src/authorization-page.tsx',
        './src/cookie-error-page.tsx',
        './src/error-page.tsx',
      ],
      output: {
        manualChunks: undefined,
        format: 'module',
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
      plugins: [bundleManifest()],
    },
    commonjsOptions: {
      include: [
        /node_modules/,
        /did/,
        /jwk/,
        /oauth-scopes/,
        /oauth-types/,
        /oauth-provider-api/,
        /syntax/,
      ],
    },
    // this
    // @NOTE the "env" arg (when defineConfig is used with a function) does not
    // allow to detect watch mode. We do want to set the "buildDelay" though to
    // avoid i18n compilation to trigger too many build (and restart of
    // dependent services).
    watch: process.argv.includes('--watch')
      ? { buildDelay: 500, clearScreen: false }
      : undefined,
  },
  optimizeDeps: {
    // Needed because this is a monorepo and it exposes CommonJS
    include: [
      '@atproto/oauth-provider-api',
      '@atproto/did',
      '@atproto/jwk',
      '@atproto/oauth-scopes',
      '@atproto/oauth-types',
      '@atproto/syntax',
      'multiformats',
    ],
  },
})
