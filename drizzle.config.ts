import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './supabase/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		host: 'localhost',
		port: 54321,
		user: 'postgres',
		password: 'postgres',
		database: 'supabase'
	}
});
