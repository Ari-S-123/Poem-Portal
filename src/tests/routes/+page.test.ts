import { describe, it, expect, vi, beforeEach } from 'vitest';
import PoemPage from '../../routes/+page.svelte';
import { render, screen, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { getPoemByTitleAndAuthor, getRandomPoem } from '$lib/api/poetry';
import { DUMMY_POEM_1 } from '../test-dummies/poems';
import { DUMMY_FAVORITE_1, DUMMY_FAVORITE_2 } from '../test-dummies/favorites';
import * as svelte from 'svelte';

vi.mock('$lib/api/poetry', () => ({
	getRandomPoem: vi.fn(),
	getPoemByTitleAndAuthor: vi.fn()
}));

const createMockAuth = (isLoggedIn = false, showFavorites = false) => ({
	isLoggedIn,
	showFavorites
});

describe('PoemPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getRandomPoem).mockReset();
		vi.mocked(getPoemByTitleAndAuthor).mockReset();
	});
	const renderWithAuth = (isLoggedIn = false, showFavorites = false) => {
		const mockGetContext = vi.spyOn(svelte, 'getContext');
		mockGetContext.mockReturnValue(createMockAuth(isLoggedIn, showFavorites));
		return render(PoemPage);
	};
	it('should render initial "Read A Poem" button', () => {
		renderWithAuth();
		expect(screen.getByText('Read A Poem')).toBeInTheDocument();
	});
	it('should show loading state when fetching poem', async () => {
		const user = userEvent.setup();
		vi.mocked(getRandomPoem).mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve(DUMMY_POEM_1), 100))
		);
		renderWithAuth();
		const button = screen.getByText('Read A Poem');
		await user.click(button);
		expect(screen.getByText('Getting A Poem')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
	});
	it('should display poem when fetch is successful', async () => {
		const user = userEvent.setup();
		vi.mocked(getRandomPoem).mockResolvedValue(DUMMY_POEM_1);
		renderWithAuth();
		const button = screen.getByText('Read A Poem');
		await user.click(button);
		await waitFor(() => {
			expect(screen.getByText(DUMMY_POEM_1.title)).toBeInTheDocument();
			expect(screen.getByText(`by ${DUMMY_POEM_1.author}`)).toBeInTheDocument();
			DUMMY_POEM_1.lines.forEach((line) => {
				expect(screen.getByText(line)).toBeInTheDocument();
			});
		});
		expect(screen.getByText('Read Another')).toBeInTheDocument();
	});
	it('should handle API errors gracefully', async () => {
		const user = userEvent.setup();
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.mocked(getRandomPoem).mockRejectedValue(new Error('API Error'));
		renderWithAuth();
		const button = screen.getByText('Read A Poem');
		await user.click(button);
		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching poem:', expect.any(Error));
		});
		expect(screen.getByText('Read A Poem')).toBeInTheDocument();
		expect(screen.getByRole('button')).not.toBeDisabled();
		consoleErrorSpy.mockRestore();
	});
	it('should show favorites button when user is logged in', () => {
		renderWithAuth(true);
		expect(screen.getByText('Favorites')).toBeInTheDocument();
	});
	it('should not show favorites button when user is not logged in', () => {
		renderWithAuth(false);
		expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
	});
	it.skip('should display favorites list when favorites button is clicked', async () => {
		const user = userEvent.setup();
		renderWithAuth(true);
		await user.click(screen.getByText('Favorites'));
		expect(screen.getByText(DUMMY_FAVORITE_1.title)).toBeInTheDocument();
		expect(screen.getByText(`by ${DUMMY_FAVORITE_1.author}`)).toBeInTheDocument();
		expect(screen.getByText(DUMMY_FAVORITE_2.title)).toBeInTheDocument();
		expect(screen.getByText(`by ${DUMMY_FAVORITE_2.author}`)).toBeInTheDocument();
	});
	it.skip('should fetch and display specific poem when favorite is clicked', async () => {
		const user = userEvent.setup();
		vi.mocked(getPoemByTitleAndAuthor).mockResolvedValueOnce(DUMMY_POEM_1);
		renderWithAuth(true);
		await user.click(screen.getByText('Favorites'));
		const button = screen.getByRole('button', {
			name: (name) => name.includes(DUMMY_FAVORITE_1.title)
		});
		await user.click(button);
		await waitFor(() => {
			expect(getPoemByTitleAndAuthor).toHaveBeenCalledWith(
				DUMMY_FAVORITE_1.author,
				DUMMY_FAVORITE_1.title
			);
			expect(screen.getByText(DUMMY_POEM_1.title)).toBeInTheDocument();
			DUMMY_POEM_1.lines.forEach((line) => {
				expect(screen.getByText(line)).toBeInTheDocument();
			});
		});
	});
	it.skip('should show loading state when fetching favorite poem', async () => {
		const user = userEvent.setup();
		vi.mocked(getPoemByTitleAndAuthor).mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve(DUMMY_POEM_1), 100))
		);
		renderWithAuth(true);
		await user.click(screen.getByText('Favorites'));
		await user.click(screen.getByText(DUMMY_FAVORITE_1.title));
		expect(screen.getByText('Getting A Poem')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
	});
	it.skip('should handle errors when fetching favorite poem', async () => {
		const user = userEvent.setup();
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.mocked(getPoemByTitleAndAuthor).mockRejectedValueOnce(new Error('API Error'));
		renderWithAuth(true);
		await user.click(screen.getByText('Favorites'));
		await user.click(screen.getByText(DUMMY_FAVORITE_1.title));
		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching poem:', expect.any(Error));
		});
		consoleErrorSpy.mockRestore();
	});
});
