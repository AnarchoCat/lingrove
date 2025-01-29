import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@media': resolve(__dirname, 'src/media'),
		},
	},
	build: {
		outDir: 'dist',
		sourcemap: true,
	},
})
