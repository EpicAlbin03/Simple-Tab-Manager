import { defaultOptions, getOptions, type Options } from '$lib/chrome/storage';
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
}

export const OptionStoreContext = new Context<OptionStore>('OptionStore');
