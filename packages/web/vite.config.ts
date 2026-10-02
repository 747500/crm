import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// dev-прокси на BFF (тот же API /api/v0)
export default defineConfig({
	plugins: [vue()],
	server: {
		host: '127.0.0.1',
		port: 5173,
		proxy: {
			'/api': {
				target: process.env.VITE_API_TARGET ?? 'http://127.0.0.1:3000',
				changeOrigin: true,
			},
		},
	},
	preview: {
		host: '127.0.0.1',
		port: 4173,
		proxy: { '/api': { target: process.env.VITE_API_TARGET ?? 'http://127.0.0.1:3000', changeOrigin: true } },
	},
})
