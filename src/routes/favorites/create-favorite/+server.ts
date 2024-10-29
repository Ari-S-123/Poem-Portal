import { createFavorite } from '$lib/api/favorites/index';
import { json } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase }, request }) => {
	const { author, title } = await request.json();
	const {
		data: { user }
	} = await supabase.auth.getUser();
	const userId = user?.id;
	if (!userId || !author || !title) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}
	const favorite = await createFavorite(userId, author, title);
	if (!favorite) {
		return json({ error: 'Could not create favorite' }, { status: 500 });
	}
	return json({ favorite }, { status: 201 });
};
