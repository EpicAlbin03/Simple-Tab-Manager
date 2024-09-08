export function isChromeExtension() {
	return (
		import.meta.env.PROD &&
		typeof window !== 'undefined' &&
		window.chrome &&
		chrome.runtime &&
		chrome.runtime.id
	);
}
