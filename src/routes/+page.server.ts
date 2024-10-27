import { db } from '$lib/db';

export const load = async () => {
	const favorites = await db.query.favoritesTable.findMany();
	return { favorites };
};
