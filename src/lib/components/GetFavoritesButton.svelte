<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import type { Auth } from '$lib/types/auth';

	interface GetFavoritesButtonProps {
		auth: Auth;
		fetchFavorites: () => Promise<void>;
	}

	let { auth, fetchFavorites }: GetFavoritesButtonProps = $props();
</script>

<Button
	aria-label="Displays all your favorite poems"
	variant="outline"
	onclick={async () => {
		if (!auth.showFavorites) await fetchFavorites();
		auth.showFavorites = !auth.showFavorites;
	}}
	>Favorites
</Button>
