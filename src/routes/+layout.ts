import { getOptions } from '$lib/chrome/storage';
import { getSystemTheme } from '$lib/theme';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async () => {
	const systemTheme = getSystemTheme();

	const options = await getOptions(systemTheme);

	return {
		options
	};
};
