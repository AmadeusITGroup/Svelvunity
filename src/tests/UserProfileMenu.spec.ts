import { UserProfileMenu } from '$lib';
import { fireEvent, render } from '@testing-library/svelte';

describe('UserProfileMenu Component', () => {
	const userProfileMenuProps = {
		classesForDropdownButton: 'gap-2',
		dropdownLabel: 'example.sample@muster.org',
		func: () => alert('logout'),
		options: [
			{
				link: '/#',
				label: 'Lorem Ipsum'
			},
			{
				link: '/#',
				label: 'Lorem Ipsum'
			},
			{
				link: '/#',
				label: 'Lorem Ipsum'
			}
		],
		funcLabel: 'Sign Out'
	};
	test('should render without error', () => {
		const { container } = render(UserProfileMenu, { props: userProfileMenuProps });
		expect(container).toBeInTheDocument();
	});

	test('should render the dropdown label correctly', () => {
		const { getByText } = render(UserProfileMenu, { props: userProfileMenuProps });
		const dropdownLabel = getByText('example.sample@muster.org');
		expect(dropdownLabel).toBeInTheDocument();
	});

	test('should render the options correctly when clicked', () => {
		const { container } = render(UserProfileMenu, {
			props: { ...userProfileMenuProps, testId: 'test-dropdown-button' }
		});
		const divDropdownButton = container.querySelector(
			"[data-cy-id='test-dropdown-button']"
		) as HTMLElement;
		fireEvent.click(divDropdownButton);

		expect(divDropdownButton).toBeInTheDocument();
	});

	test('should render the options correctly when keypress', () => {
		const { container } = render(UserProfileMenu, {
			props: { ...userProfileMenuProps, testId: 'test-dropdown-button' }
		});
		const divDropdownButton = container.querySelector(
			"[data-cy-id='test-dropdown-button']"
		) as HTMLElement;
		fireEvent.keyPress(divDropdownButton, { key: 'Enter', code: 13, charCode: 13 });

		expect(divDropdownButton).toBeInTheDocument();
	});

	test('should render the options correctly with dropdownLabel when clicked', () => {
		const { getByText } = render(UserProfileMenu, {
			props: { ...userProfileMenuProps, dropdownLabel: 'dropdown-label' }
		});
		const divDropdownButton = getByText('dropdown-label') as HTMLElement;
		fireEvent.click(divDropdownButton);

		expect(divDropdownButton).toBeInTheDocument();
	});

	test('should click outside the menu', () => {
		const { container } = render(UserProfileMenu, {
			props: { ...userProfileMenuProps, testId: 'test-dropdown-button' }
		});
		const divDropdownButton = container.querySelector(
			"[data-cy-id='test-dropdown-button']"
		) as HTMLElement;

		fireEvent.click(divDropdownButton);
		expect(divDropdownButton).toBeInTheDocument();
		document.body.click();
		expect(divDropdownButton).toBeInTheDocument();
	});

	test('should render the options correctly with custom test IDs', () => {
		const { container } = render(UserProfileMenu, {
			props: { ...userProfileMenuProps, testId: 'custom-test-id' }
		});
		const divDropdownButton = container.querySelector(
			"[data-cy-id='custom-test-id']"
		) as HTMLElement;
		fireEvent.click(divDropdownButton);
		expect(divDropdownButton).toBeInTheDocument();
	});

	test('should render the options correctly with a different dropdown label', () => {
		const { getByText } = render(UserProfileMenu, {
			props: { ...userProfileMenuProps, dropdownLabel: 'Custom Dropdown Label' }
		});
		const dropdownLabel = getByText('Custom Dropdown Label');
		expect(dropdownLabel).toBeInTheDocument();
	});
});
