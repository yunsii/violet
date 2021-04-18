import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteSingleFile } from 'vite-plugin-singlefile';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/violet/',
  plugins: [
    reactRefresh(),
    tsconfigPaths(),
    // JS 代码打包成单个文件，避免引入模块依赖
    // ref: https://github.com/richardtallent/vite-plugin-singlefile#how-do-i-use-it
    viteSingleFile(),
    // ref: https://github.com/vitejs/vite/issues/1231#issuecomment-753549857
    copy({
      targets: [{ src: './manifest.json', dest: 'dist' }],
      hook: 'writeBundle',
    }),
  ],
  esbuild: {
    jsxInject: "import * as React from 'react'",
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    target: 'es6',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    emptyOutDir: false,
    rollupOptions: {
      inlineDynamicImports: true,
      output: {
        manualChunks: () => 'everything.js',
        // without hash
        // ref: https://github.com/vitejs/vite/issues/378#issuecomment-768816653
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
