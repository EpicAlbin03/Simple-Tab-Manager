import { test as base, chromium, type BrowserContext, type Worker } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { dummyWindows } from '$lib/dummydata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function waitForServiceWorker(context: BrowserContext) {
	let [serviceWorker] = context.serviceWorkers();
	if (!serviceWorker) {
		serviceWorker = await context.waitForEvent('serviceworker');
	}
	return serviceWorker;
}

async function openDummyWindows(serviceWorker: Worker) {
	for (const dummyWindow of dummyWindows) {
		const urls = dummyWindow.tabs.map((tab) => tab.url).filter((url) => url);

		if (urls.length > 0) {
			await serviceWorker.evaluate(async (tabUrls) => {
				await chrome.windows.create({
					url: tabUrls,
					focused: false
				});
			}, urls);
		}
	}
}

export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
}>({
	// eslint-disable-next-line no-empty-pattern
	context: async ({}, use) => {
		const pathToExtension = path.join(__dirname, '..', '..', 'build');
		const context = await chromium.launchPersistentContext('', {
			headless: false,
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`
			]
		});

		const serviceWorker = await waitForServiceWorker(context);
		await openDummyWindows(serviceWorker);

		await use(context);
		await context.close();
	},
	extensionId: async ({ context }, use) => {
		const serviceWorker = await waitForServiceWorker(context);
		const extensionId = serviceWorker.url().split('/')[2];
		await use(extensionId);
	}
});

export const expect = test.expect;
