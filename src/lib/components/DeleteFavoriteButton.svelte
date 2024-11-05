<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';

	interface DeleteFavoriteButtonProps {
		removeFavorite: (author: string, title: string) => Promise<void>;
		author: string;
		title: string;
		children: Snippet;
	}

	let { removeFavorite, author, title, children }: DeleteFavoriteButtonProps = $props();
</script>

<Button
	variant="outline"
	size="icon"
	aria-label="Removes this poem as a favorite"
	onclick={() => removeFavorite(author, title)}
>
	{@render children()}
</Button>
