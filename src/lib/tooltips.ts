import tippy, { type Instance, type Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

function bottomTippy(delay:number) {
	return tippy(document.querySelectorAll('.bottomTippy'), {
		placement: 'bottom',
		delay: [delay, 0]
	});
}

function bottomEndTippy(delay:number) {
	return tippy(document.querySelectorAll('.bottomEndTippy'), {
		placement: 'bottom-end',
		delay: [delay, 0]
	});
}

function topTippy(delay:number) {
	return tippy(document.querySelectorAll('.topTippy'), {
		placement: 'top',
		delay: [delay, 0]
	});
}

async function createTooltips() {
	const { tooltipsDelay } = await chrome.storage.sync.get('tooltipsDelay');
	const bottomInstance = bottomTippy(tooltipsDelay);
	const bottomEndInstance = bottomEndTippy(tooltipsDelay);
	const bottomTopInstance = topTippy(tooltipsDelay);
	return [bottomInstance, bottomEndInstance, bottomTopInstance];
}

function destroyTooltips(instances: Array<Instance<Props>[]>) {
	for (const instance of instances) {
		if (instance) {
			for (const tooltip of instance) {
				tooltip.destroy();
			}
		}
	}
}

let tippyInstances: Array<Instance<Props>[]> = [];
export async function handleTooltips() {
	const { tooltips } = await chrome.storage.sync.get(`tooltips`) ?? false;
		if (tooltips) {
			if (tippyInstances) destroyTooltips(tippyInstances);
			tippyInstances =  await createTooltips();
		} else {
			destroyTooltips(tippyInstances);
		}
}