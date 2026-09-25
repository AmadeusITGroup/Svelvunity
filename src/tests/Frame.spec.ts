import { render, fireEvent } from '@testing-library/svelte';
import { createRawSnippet, type ComponentProps } from 'svelte';
import Frame from '$lib/components/Frame.svelte';

const content = createRawSnippet(() => ({ render: () => '<span>Frame content</span>' }));

// action and tabindex have defaults but are typed as required
const props = (p: Partial<ComponentProps<typeof Frame>>) => p as ComponentProps<typeof Frame>;

describe('Frame component', () => {
	test('renders a div with default classes and its children', () => {
		const { container, getByText } = render(Frame, {
			props: props({ tabindex: undefined, children: content })
		});

		const el = container.firstElementChild as HTMLElement;
		expect(el.tagName).toBe('DIV');
		expect(el).toHaveClass('bg-white', 'text-gray-500', 'border-gray-50', 'divide-gray-50');
		expect(el).not.toHaveClass('rounded-lg', 'border', 'shadow-md');
		expect(getByText('Frame content')).toBeInTheDocument();
	});

	test('renders an anchor when href is set', () => {
		const { container } = render(Frame, {
			props: props({ href: '/somewhere', tabindex: undefined })
		});

		expect(container.firstElementChild!.tagName).toBe('A');
	});

	test('applies rounded, border and shadow classes', () => {
		const { container } = render(Frame, {
			props: props({ rounded: true, border: true, shadow: true, tabindex: undefined })
		});

		expect(container.firstElementChild).toHaveClass('rounded-lg', 'border', 'shadow-md');
	});

	test('custom classes override conflicting color classes', () => {
		const { container } = render(Frame, {
			props: props({
				bgColor: 'bg-white',
				textColor: 'text-gray-500',
				classes: 'bg-red-500 text-black p-4',
				tabindex: undefined
			})
		});

		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('bg-red-500', 'text-black', 'p-4');
		expect(el).not.toHaveClass('bg-white', 'text-gray-500');
	});

	test('sets role and tabindex attributes', () => {
		const { container } = render(Frame, { props: props({ role: 'dialog', tabindex: 2 }) });

		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveAttribute('role', 'dialog');
		expect(el).toHaveAttribute('tabindex', '2');
	});

	test('runs the action with the node and options', () => {
		const action = vi.fn();
		const options = { key: 'value' };
		const { container } = render(Frame, {
			props: props({ action, options, tabindex: undefined })
		});

		expect(action).toHaveBeenCalledWith(container.firstElementChild, options);
	});

	test('forwards click, mouse and focus events', async () => {
		const handlers = {
			onclick: vi.fn(),
			onmouseenter: vi.fn(),
			onmouseleave: vi.fn(),
			onfocusin: vi.fn(),
			onfocusout: vi.fn()
		};
		const { container } = render(Frame, { props: props({ ...handlers, tabindex: 0 }) });
		const el = container.firstElementChild as HTMLElement;

		await fireEvent.click(el);
		await fireEvent.mouseEnter(el);
		await fireEvent.mouseLeave(el);
		await fireEvent.focusIn(el);
		await fireEvent.focusOut(el);

		Object.values(handlers).forEach((handler) => expect(handler).toHaveBeenCalledTimes(1));
	});
});
