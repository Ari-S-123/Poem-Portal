import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';
import { eq } from 'drizzle-orm';
import { favoritesTable } from './schema';
import { v4 as uuid } from 'uuid';
import { error } from '@sveltejs/kit';

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });

export const getOrCreateFavorite = async (userId: string, author: string, title: string) => {
	const currentFavorite = await db.query.favoritesTable.findFirst({
		where: eq(favoritesTable.id, userId)
	});
	if (currentFavorite) {
		return currentFavorite;
	}
	await db.insert(favoritesTable).values({
		id: uuid(),
		user_id: userId,
		author,
		title
	});
	const newFavorite = await db.query.favoritesTable.findFirst({
		where: eq(favoritesTable.id, userId)
	});
	if (!newFavorite) {
		error(500, 'Could not create favorite');
	}
	return newFavorite;
};

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
