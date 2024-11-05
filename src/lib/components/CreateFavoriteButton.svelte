<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Poem } from '$lib/types/poem';
	import type { Snippet } from 'svelte';

	interface CreateFavoriteButtonProps {
		createFavorite: (author: string, title: string) => Promise<void>;
		poem: Poem;
		children: Snippet;
	}

	let { createFavorite, poem, children }: CreateFavoriteButtonProps = $props();
</script>

<Button
	variant="outline"
	size="icon"
	aria-label="Adds this poem as a favorite"
	onclick={() => {
		if (poem === undefined) console.error('No poem to favorite');
		else createFavorite(poem.author, poem.title);
	}}
>
	{@render children()}
</Button>
