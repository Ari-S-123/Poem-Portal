import { describe, it, expect, vi, beforeEach } from 'vitest';
import PoemPage from '../../routes/+page.svelte';
import { render, screen, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { getRandomPoem } from '$lib/api/poetry';

const mockPoem = {
	title: 'Test Poem',
	author: 'Test Author',
	lines: ['Line 1', 'Line 2', 'Line 3']
};

vi.mock('$lib/api/poetry', () => ({
	getRandomPoem: vi.fn()
}));

describe('PoemPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it('should render initial "Read A Poem" button', () => {
		render(PoemPage);
		expect(screen.getByText('Read A Poem')).toBeInTheDocument();
	});
	it('should show loading state when fetching poem', async () => {
		const user = userEvent.setup();
		vi.mocked(getRandomPoem).mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve(mockPoem), 100))
		);
		render(PoemPage);
		const button = screen.getByText('Read A Poem');
		await user.click(button);
		expect(screen.getByText('Getting A Poem')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
	});
	it('should display poem when fetch is successful', async () => {
		const user = userEvent.setup();
		vi.mocked(getRandomPoem).mockResolvedValue(mockPoem);
		render(PoemPage);
		const button = screen.getByText('Read A Poem');
		await user.click(button);
		await waitFor(() => {
			expect(screen.getByText('Test Poem')).toBeInTheDocument();
			expect(screen.getByText('by Test Author')).toBeInTheDocument();
			expect(screen.getByText('Line 1')).toBeInTheDocument();
			expect(screen.getByText('Line 2')).toBeInTheDocument();
			expect(screen.getByText('Line 3')).toBeInTheDocument();
		});
		expect(screen.getByText('Read Another')).toBeInTheDocument();
	});
	it('should handle API errors gracefully', async () => {
		const user = userEvent.setup();
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.mocked(getRandomPoem).mockRejectedValue(new Error('API Error'));
		render(PoemPage);
		const button = screen.getByText('Read A Poem');
		await user.click(button);
		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching poem:', expect.any(Error));
		});
		expect(screen.getByText('Read A Poem')).toBeInTheDocument();
		expect(screen.getByRole('button')).not.toBeDisabled();
		consoleErrorSpy.mockRestore();
	});
	it('should disable button and show loading state when fetching another poem', async () => {
		const user = userEvent.setup();
		vi.mocked(getRandomPoem)
			.mockResolvedValueOnce(mockPoem)
			.mockImplementationOnce(
				() =>
					new Promise((resolve) =>
						setTimeout(
							() =>
								resolve({
									...mockPoem,
									title: 'Second Poem',
									author: 'Test Author 2'
								}),
							100
						)
					)
			);
		render(PoemPage);
		await user.click(screen.getByText('Read A Poem'));
		await waitFor(() => {
			expect(screen.getByText('Test Poem')).toBeInTheDocument();
		});
		await user.click(screen.getByText('Read Another'));
		expect(screen.getByText('Getting Another Poem')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
		await waitFor(() => {
			expect(screen.getByText('Second Poem')).toBeInTheDocument();
			expect(screen.getByText('by Test Author 2')).toBeInTheDocument();
			expect(screen.getByText('Line 1')).toBeInTheDocument();
			expect(screen.getByText('Line 2')).toBeInTheDocument();
			expect(screen.getByText('Line 3')).toBeInTheDocument();
		});
		expect(screen.getByText('Read Another')).toBeInTheDocument();
	});
});
