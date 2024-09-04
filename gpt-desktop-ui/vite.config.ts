// @ts-ignore
import {defineConfig, loadEnv} from 'vite'
// @ts-ignore
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'

import electron from "vite-plugin-electron";
import {notBundle} from 'vite-plugin-electron/plugin'
// @ts-ignore
import renderer from 'vite-plugin-electron-renderer'

import {rmSync} from 'node:fs'
// @ts-ignore
import pkg from './package.json'
import VueDevTools from 'vite-plugin-vue-devtools'


// CKEditor
import {createRequire} from 'node:module';
import {URL} from 'node:url';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
// @ts-ignore
import vueJsx from '@vitejs/plugin-vue-jsx'


import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from "path";
import {univerPlugin} from "@univerjs/vite-plugin";

const require = createRequire(import.meta.url);
// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  rmSync('dist-electron', {recursive: true, force: true})
  // console.log(process.env)
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG
  // console.log(sourcemap)
  const env = loadEnv(mode, process.cwd());
  // console.log(env)
  return {
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        // directoryAsNamespace: true,
      }),
      ckeditor5({theme: require.resolve('@ckeditor/ckeditor5-theme-lark')}),
      vue({
        template: {transformAssetUrls}
      }),
      quasar({
        sassVariables: 'src/quasar-variables.sass',
        runMode: 'web-client',
      }),
      univerPlugin(),
      electron([
        {
          entry: 'electron/main/index.ts',
          onstart: ({startup}) => {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                // we can use `external` to exclude them to ensure they work correctly.
                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                // Of course, this is not absolute, just this way is relatively simple. :)
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
            plugins: [
              // This is just an option to improve build performance, it's non-deterministic!
              // e.g. `import log from 'electron-log'` -> `const log = require('electron-log')`
              isServe && notBundle(),
            ],
          }
        },
        {
          entry: 'electron/preload/index.ts',
          onstart({reload}) {
            // Notify the Renderer process to reload the page when the Preload scripts build is complete,
            // instead of restarting the entire Electron App.
            reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
            plugins: [
              isServe && notBundle(),
            ],
          },
        },
        {
          entry: 'electron/utils/index.ts',
          onstart({reload}) {
            // Notify the Renderer process to reload the page when the Preload scripts build is complete,
            // instead of restarting the entire Electron App.
            reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/utils',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
            plugins: [
              isServe && notBundle(),
            ],
          },
        },
      ]),
      renderer(),
    ],
    server: {
      host: true,
      // 跨域设置允许
      cors: true,
      // 如果端口已占用直接退出
      strictPort: true,
    },
    clearScreen: false,
    build:{
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      electronBuild: {}
    }
  }
})
