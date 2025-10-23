import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
	testDir: 'src/e2e',
	fullyParallel: process.env.CI ? false : true,
	forbidOnly: !!process.env.CI,
	retries: 2,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		trace: 'on-first-retry'
	}
});
