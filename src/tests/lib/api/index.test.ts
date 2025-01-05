import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFavorites, createFavorite, deleteFavorite } from '$lib/api/favorites/index';
import { favoritesTable } from '$lib/db/schema';
import type { Mock } from 'vitest';
import { db } from '$lib/db/index';
import { DUMMY_FAVORITE_1, DUMMY_FAVORITE_2 } from '../../test-dummies/favorites';

vi.mock('uuid', () => ({
	v4: () => DUMMY_FAVORITE_1.user_id
}));

vi.mock('@sveltejs/kit', () => ({
	error: (status: number, message: string) => {
		throw new Error(`${status}: ${message}`);
	}
}));

vi.mock('$lib/db/index', () => ({
	db: {
		query: {
			favoritesTable: {
				findMany: vi.fn()
			}
		},
		insert: vi.fn(),
		delete: vi.fn()
	}
}));

describe('Favorites API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	describe('getFavorites', () => {
		it('should return favorites for a given user ID', async () => {
			const mockFavorites = [DUMMY_FAVORITE_1, DUMMY_FAVORITE_2];
			(db.query.favoritesTable.findMany as Mock).mockResolvedValue(mockFavorites);
			const result = await getFavorites(DUMMY_FAVORITE_1.user_id);
			expect(result).toEqual(mockFavorites);
			expect(db.query.favoritesTable.findMany).toHaveBeenCalledWith({
				where: expect.any(Object)
			});
		});
		it('should throw an error when no favorites are found', async () => {
			(db.query.favoritesTable.findMany as Mock).mockResolvedValue(null);
			await expect(getFavorites(DUMMY_FAVORITE_1.user_id)).rejects.toThrow(
				'500: Could not find favorites'
			);
		});
	});
	describe('createFavorite', () => {
		it('should create and return a new favorite', async () => {
			const mockReturning = vi.fn().mockResolvedValue([DUMMY_FAVORITE_1]);
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
			(db.insert as Mock).mockReturnValue({ values: mockValues });
			const result = await createFavorite(
				DUMMY_FAVORITE_1.user_id,
				DUMMY_FAVORITE_1.author,
				DUMMY_FAVORITE_1.title
			);
			expect(result).toEqual([DUMMY_FAVORITE_1]);
			expect(db.insert).toHaveBeenCalledWith(favoritesTable);
			expect(mockValues).toHaveBeenCalledWith(DUMMY_FAVORITE_1);
		});
		it('should throw an error when creation fails', async () => {
			const mockReturning = vi.fn().mockResolvedValue(null);
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
			(db.insert as Mock).mockReturnValue({ values: mockValues });
			await expect(
				createFavorite(DUMMY_FAVORITE_1.user_id, DUMMY_FAVORITE_1.author, DUMMY_FAVORITE_1.title)
			).rejects.toThrow('500: Could not create favorite');
		});
	});
	describe('deleteFavorite', () => {
		it('should delete and return the favorite', async () => {
			const mockReturning = vi.fn().mockResolvedValue([DUMMY_FAVORITE_1]);
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
			(db.delete as Mock).mockReturnValue({ where: mockWhere });
			const result = await deleteFavorite(
				DUMMY_FAVORITE_1.user_id,
				DUMMY_FAVORITE_1.author,
				DUMMY_FAVORITE_1.title
			);
			expect(result).toEqual([DUMMY_FAVORITE_1]);
			expect(db.delete).toHaveBeenCalledWith(favoritesTable);
			expect(mockWhere).toHaveBeenCalledWith(expect.any(Object));
		});
		it('should throw an error when deletion fails', async () => {
			const mockReturning = vi.fn().mockResolvedValue(null);
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
			(db.delete as Mock).mockReturnValue({ where: mockWhere });
			await expect(
				deleteFavorite(DUMMY_FAVORITE_1.user_id, DUMMY_FAVORITE_1.author, DUMMY_FAVORITE_1.title)
			).rejects.toThrow('500: Could not delete favorite');
		});
	});
});
