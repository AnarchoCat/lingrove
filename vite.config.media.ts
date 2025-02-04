import { defineConfig } from 'vite'
import commonOptions from './vite.config.common'
import vue from '@vitejs/plugin-vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ mode }) => {
	return {
		...commonOptions,
		plugins: [vue()],
		build: {
			outDir: 'dist/media',
			rollupOptions: {
				input: {
					catScratchEditor: '@/catScratchEditor/main.ts',
					dictionaryView: '@/dictionaryView/main.ts',
					searchView: '@/searchView/main.ts',
				},
				output: {
					entryFileNames: '[name].js',
					format: 'es',
					assetFileNames: '[name].[ext]',
					chunkFileNames: '[name].js',
				},
			},
		},
	}
})
