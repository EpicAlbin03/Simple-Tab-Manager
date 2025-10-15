import { version } from '$app/environment';

export function isChromeExtension() {
	return (
		import.meta.env.PROD &&
		typeof window !== 'undefined' &&
		window.chrome &&
		chrome.runtime &&
		chrome.runtime.id
	);
}

export async function getExtensionVersion() {
	if (isChromeExtension()) {
		const manifest = await chrome.runtime.getManifest();
		return manifest.version;
	} else {
		return version;
	}
}

export function extractURL(url: string) {
	return url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
}
