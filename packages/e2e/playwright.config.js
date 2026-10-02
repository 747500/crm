const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
	testDir: './tests',
	workers: 1,
	timeout: 30000,
	use: {
		baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:3000',
		headless: true,
		launchOptions: { args: ['--no-sandbox'] },
	},
})
