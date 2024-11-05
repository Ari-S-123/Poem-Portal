import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const favoritesTable = pgTable('favorite', {
	id: uuid('id').primaryKey(),
	user_id: uuid('user_id').notNull(),
	author: text('author').notNull(),
	title: text('title').notNull()
});
