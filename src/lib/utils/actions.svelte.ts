export function trapFocus(node: HTMLElement) {
	function handleFocusTrap(e) {
		const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

		if (!isTabPressed) {
			return;
		}

		const tabbable = Array.from(node.querySelectorAll(selectorTabbable));

		let index = tabbable.indexOf(document.activeElement ?? node);
		if (index === -1 && e.shiftKey) {
			index = 0;
		}
		index += tabbable.length + (e.shiftKey ? -1 : 1);
		index %= tabbable.length;
		tabbable[index].focus();

		e.preventDefault();
	}

	document.addEventListener('keydown', handleFocusTrap, true);

	return {
		destroy() {
			document.removeEventListener('keydown', handleFocusTrap, true);
		}
	};
}
