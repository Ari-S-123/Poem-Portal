import { eq } from 'drizzle-orm';
import { favoritesTable } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { v4 as uuid } from 'uuid';

/**
 * Get all favorites by user id
 * @param {string} userId The id of the user currently logged in
 * @returns A promise that resolves to the favorites that were found
 * @throws {Error} If the request fails
 * @example
 * const favorites = await getFavorites('123');
 * console.log(favorites);
 * // [{ id: '123', author: 'Edgar Allan Poe', title: 'The Raven' }, { id: '123', author: 'William Shakespeare', title: 'Sonnet' }]
 * @see https://orm.drizzle.team/docs/rqb#find-many
 */
export const getFavorites = async (userId: string) => {
	const favorites = await db.query.favoritesTable.findMany({
		where: eq(favoritesTable.user_id, userId)
	});
	if (!favorites) {
		error(500, 'Could not find favorites');
	}
	return favorites;
};

/**
 * Create a favorite by user id, author, and title
 * @param {string} userId The id of the user currently logged in
 * @param {string} author The author of the poem
 * @param {string} title The title of the poem
 * @returns A promise that resolves to the favorite that was created
 * @throws {Error} If the request fails
 * @example
 * const favorite = await createFavorite('123', 'Edgar Allan Poe', 'The Raven');
 * console.log(favorite.id, favorite.author, favorite.title);
 * // "123" "Edgar Allan Poe" "The Raven"
 * @see https://orm.drizzle.team/docs/insert
 */
export const createFavorite = async (userId: string, author: string, title: string) => {
	const newFavorite = await db
		.insert(favoritesTable)
		.values({
			id: uuid(),
			user_id: userId,
			author,
			title
		})
		.returning();
	if (!newFavorite) {
		error(500, 'Could not create favorite');
	}
	return newFavorite;
};

/**
 * Delete a favorite by user id, author, and title
 * @param {string} userId The id of the user currently logged in
 * @param {string} author The author of the poem
 * @param {string} title The title of the poem
 * @returns A promise that resolves to the favorite that was deleted
 * @throws {Error} If the request fails
 * @example
 * const favorite = await createFavorite('123', 'Edgar Allan Poe', 'The Raven');
 * console.log(favorite.id, favorite.author, favorite.title);
 * // "123" "Edgar Allan Poe" "The Raven"
 * @see https://orm.drizzle.team/docs/delete
 */
export const deleteFavorite = async (userId: string, author: string, title: string) => {
	const deletedFavorite = await db
		.delete(favoritesTable)
		.where(
			eq(favoritesTable.user_id, userId) &&
				eq(favoritesTable.author, author) &&
				eq(favoritesTable.title, title)
		)
		.returning();
	if (!deletedFavorite) {
		error(500, 'Could not delete favorite');
	}
	return deletedFavorite;
};
