import { test as base, chromium, type BrowserContext, type Worker } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { dummyWindows } from './data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function waitForServiceWorker(context: BrowserContext) {
	/*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

	// for manifest v3:
	let [serviceWorker] = context.serviceWorkers();
	if (!serviceWorker) {
		serviceWorker = await context.waitForEvent('serviceworker');
	}
	return serviceWorker;
}

async function openDummyWindows(serviceWorker: Worker) {
	const promises = dummyWindows.map(async (urls) => {
		return await serviceWorker.evaluate(async (tabUrls) => {
			return (await chrome.windows.create({
				url: tabUrls,
				focused: false
			})) as ChromeWindow;
		}, urls);
	});

	const results = await Promise.all(promises);
	return results.filter((window): window is ChromeWindow => window !== null);
}

export const test = base.extend<{
	context: BrowserContext;
	extensionId: string;
	windows: ChromeWindow[];
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

		await use(context);
		await context.close();
	},
	extensionId: async ({ context }, use) => {
		const serviceWorker = await waitForServiceWorker(context);
		const extensionId = serviceWorker.url().split('/')[2];
		await use(extensionId);
	},
	windows: async ({ context, page, extensionId }, use) => {
		const serviceWorker = await waitForServiceWorker(context);
		const windows = await openDummyWindows(serviceWorker);
		await page.goto(`chrome-extension://${extensionId}/index.html`);
		await page.waitForTimeout(5000); // Wait for the tabs to load
		await use(windows);
	}
});

export const expect = test.expect;
