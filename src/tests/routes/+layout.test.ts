import { vi, describe, it, expect, beforeEach } from 'vitest';
import Layout from '../../routes/+layout.svelte';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { setMode, resetMode } from 'mode-watcher';

interface AnimationEffect {
	finished: Promise<void>;
	cancel: () => void;
	startTime: number | undefined;
	currentTime: number | undefined;
}

Element.prototype.animate = vi.fn().mockReturnValue({
	finished: Promise.resolve(),
	cancel: vi.fn(),
	startTime: undefined,
	currentTime: undefined
} as AnimationEffect);

vi.mock('mode-watcher', () => {
	const SvelteComponentMock = vi.fn();
	return {
		setMode: vi.fn(),
		resetMode: vi.fn(),
		ModeWatcher: SvelteComponentMock
	};
});

describe.skip('Layout Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it('should set correct page title and meta description', () => {
		render(Layout);
		expect(document.title).toBe('Poem Portal');
		const metaDescription = document.head.querySelector('meta[name="description"]');
		expect(metaDescription).not.toBeNull();
		expect(metaDescription?.getAttribute('name')).toBe('description');
		expect(metaDescription?.getAttribute('content')).toBe(
			'Poem Portal is an app that surprises poetry enthusiasts with a random poem.'
		);
	});
	it('should have proper CSS classes for layout container', () => {
		const { container } = render(Layout);
		const mainDiv = container.querySelector('.min-h-screen');
		expect(mainDiv).toHaveClass('min-h-screen', 'transition-colors', 'duration-300');
	});
	it('should have proper CSS classes for navigation', () => {
		const { container } = render(Layout);
		const nav = container.querySelector('nav');
		expect(nav).toHaveClass('p-4', 'flex', 'justify-end');
	});
});

describe.skip('Authentication UI', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it('should show login button when not logged in', () => {
		render(Layout);
		const loginButton = screen.getByRole('button', { name: /login/i });
		expect(loginButton).toBeInTheDocument();
		expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
	});
	it('should show user info and logout button when logged in', async () => {
		const user = userEvent.setup();
		render(Layout);
		const loginButton = screen.getByRole('button', { name: /login/i });
		await user.click(loginButton);
		expect(screen.getByText(/welcome, username/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
		expect(loginButton).not.toBeInTheDocument();
	});
	it('should show avatar when logged in', async () => {
		const user = userEvent.setup();
		render(Layout);
		await user.click(screen.getByRole('button', { name: /login/i }));
		const avatar = screen.getByTestId('avatar');
		expect(avatar).toBeInTheDocument();
	});
	it('should return to login state after logout', async () => {
		const user = userEvent.setup();
		render(Layout);
		await user.click(screen.getByRole('button', { name: /login/i }));
		await user.click(screen.getByRole('button', { name: /logout/i }));
		expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
		expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
	});
	it('should show tooltips on hover', async () => {
		const user = userEvent.setup();
		render(Layout);
		const loginButton = screen.getByRole('button', { name: /login/i });
		await user.hover(loginButton);
		expect(screen.getByText('Login')).toBeInTheDocument();
		await user.click(loginButton);
		const logoutButton = screen.getByRole('button', { name: /logout/i });
		await user.hover(logoutButton);
		expect(screen.getByText('Logout')).toBeInTheDocument();
	});
});

describe.skip('Theme Toggle', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it('mode functions are available and can be called', () => {
		expect(setMode).toBeDefined();
		expect(resetMode).toBeDefined();
		setMode('dark');
		expect(setMode).toHaveBeenCalledWith('dark');
		resetMode();
		expect(resetMode).toHaveBeenCalled();
	});
	it('should have a dark mode toggle button with the correct symbols', () => {
		const { container } = render(Layout);
		const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
		expect(toggleButton).toBeInTheDocument();
		const sunIcon = container.querySelector('.scale-100');
		const moonIcon = container.querySelector('.scale-0');
		expect(sunIcon).toBeInTheDocument();
		expect(moonIcon).toBeInTheDocument();
	});
	it('clicking dark mode toggle changes symbol', async () => {
		const user = userEvent.setup();
		render(Layout);
		const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
		await user.click(toggleButton);
		const darkOption = screen.getByText('Dark');
		await user.click(darkOption);
		expect(setMode).toHaveBeenCalledWith('dark');
	});
	it('clicking light mode toggle changes symbol', async () => {
		const user = userEvent.setup();
		render(Layout);
		const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
		await user.click(toggleButton);
		const lightOption = screen.getByText('Light');
		await user.click(lightOption);
		expect(setMode).toHaveBeenCalledWith('light');
	});
	it('clicking system option resets mode', async () => {
		const user = userEvent.setup();
		render(Layout);
		const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
		await user.click(toggleButton);
		const systemOption = screen.getByText('System');
		await user.click(systemOption);
		expect(resetMode).toHaveBeenCalled();
	});
});
