import { getFavorites } from '$lib/api/favorites/index';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase } }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	const userId = user?.id;
	if (!userId) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}
	const favorites = await getFavorites(userId);
	if (!favorites) {
		return json({ error: 'Favorite not found' }, { status: 404 });
	}
	return json({ favorites }, { status: 200 });
};
