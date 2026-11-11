import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/index.tsx'],
        format: ['esm'],
        ignoreWatch: ['**/*.md'],
        sourcemap: true,
        bundle: true,
        dts: true,
        clean: true,
        minify: true,
        outDir: 'build/esm',
    },
])
