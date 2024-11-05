<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import type { Favorite } from '$lib/types/favorite';
	import DeleteFavoriteButton from './DeleteFavoriteButton.svelte';
	import { Trash } from 'lucide-svelte/icons';

	interface FavoriteViewProps {
		favorite: Favorite;
		removeFavorite: (author: string, title: string) => Promise<void>;
		fetchPoemByTitleAndAuthor: (author: string, title: string) => Promise<void>;
	}

	let { favorite, fetchPoemByTitleAndAuthor, removeFavorite }: FavoriteViewProps = $props();
</script>

<div aria-label="Favorite Container" class="flex flex-row items-center justify-center">
	<Button
		aria-label="Gets and displays this favorite poem"
		variant="outline"
		size="lg"
		class="min-w-full p-8 flex flex-row items-center justify-center"
		onclick={() => {
			fetchPoemByTitleAndAuthor(favorite.author, favorite.title);
		}}
	>
		<div aria-label="Poem Details" class="flex flex-col gap-2">
			<b aria-label="Poem Title">{favorite.title}</b>
			<i aria-label="Poem Author">by {favorite.author}</i>
		</div>
	</Button>
	<div class="mx-2 p-2">
		<DeleteFavoriteButton {removeFavorite} author={favorite.author} title={favorite.title}>
			<Trash class="h-6 w-6" />
		</DeleteFavoriteButton>
	</div>
</div>
