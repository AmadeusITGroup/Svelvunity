export function trapFocus(node: HTMLElement) {
	const previous = document.activeElement;

	function focusable() {
		const selectorTabbable = `
		  a[href], area[href], input:not([disabled]):not([tabindex='-1']),
		  button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),
		  textarea:not([disabled]):not([tabindex='-1']),
		  iframe, object, embed, *[tabindex]:not([tabindex='-1']):not([disabled]), *[contenteditable=true]
		`;

		return Array.from(node.querySelectorAll(selectorTabbable)) as HTMLElement[];
	}

	function handleKeydown(event: KeyboardEvent) {
		const isTabPressed = event.key === 'Tab';

		if (!isTabPressed) {
			return;
		}

		const current = document.activeElement;

		const elements = focusable();
		const first = elements.at(0);
		const last = elements.at(-1);

		if (event.shiftKey && current === first) {
			last?.focus();
			event.preventDefault();
		}

		if (!event.shiftKey && current === last) {
			first?.focus();
			event.preventDefault();
		}
	}

	$effect(() => {
		focusable()[0]?.focus();
		node.addEventListener('keydown', handleKeydown);

		return () => {
			node.removeEventListener('keydown', handleKeydown);
			(previous as HTMLElement | null)?.focus();
		};
	});
}
