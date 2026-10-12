import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { templateCompilerOptions } from '@tresjs/core';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    base: '/portfolio-tres/',
    plugins: [
        vue({
            ...templateCompilerOptions,
        }),
        // vueDevTools(),
        tailwindcss(),

    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "imports" as *;`,
                loadPaths: [
                    path.resolve(process.cwd(), 'src/style'),
                ],
                quietDeps: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
