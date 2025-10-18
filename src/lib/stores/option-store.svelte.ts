import { defaultOptions, getOptions, setOptions, type Options } from '$lib/chrome/storage';
import { Context } from 'runed';

export class OptionStore {
	options = $state<Options>(defaultOptions);

	constructor() {
		this.loadOptions();
	}

	private async loadOptions() {
		const options = await getOptions();
		this.options = options;
	}

	async updateOptions(options: Partial<Options>) {
		this.options = { ...this.options, ...options };
		await setOptions(this.options);
	}

	async resetOptions() {
		this.options = defaultOptions;
		await setOptions(this.options);
	}
}

export const OptionStoreContext = new Context<OptionStore>('OptionStore');
