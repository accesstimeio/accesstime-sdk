import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/**/*.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: true,
    treeshake: true,
    bundle: true
});
