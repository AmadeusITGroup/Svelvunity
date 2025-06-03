/** Dispatch event on click outside of node */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck+

export let $$events_def: {
	click_outside: CustomEvent<{ target: HTMLElement }>;
};

export function clickOutside(node: HTMLElement, clickOutsideAction: any) {
	const handleClick = (event: MouseEvent) => {
		if (
			node &&
			!node.contains(event.target as Node) &&
			!event.defaultPrevented &&
			clickOutsideAction
		) {
			clickOutsideAction(node);
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
