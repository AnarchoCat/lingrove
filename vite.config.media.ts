import { defineConfig } from 'vite'
import commonOptions from './vite.config.common'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ mode }) => {
	return {
		...commonOptions,
		build: {
			outDir: 'dist/media',
			rollupOptions: {
				input: {
					test: '@media/test.ts',
				},
				output: {
					entryFileNames: '[name].js',
					format: 'es',
					assetFileNames: '[name].[ext]',
				},
			},
		},
	}
})
