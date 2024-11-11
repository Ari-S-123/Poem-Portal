<script lang="ts">
	import type { Poem } from '$lib/types/poem';
	import { getRandomPoem, getPoemByTitleAndAuthor } from '$lib/api/poetry';
	import Star from 'lucide-svelte/icons/star';
	import { getContext } from 'svelte';
	import type { Auth } from '$lib/types/auth';
	import type { Favorite } from '$lib/types/favorite';
	import FavoriteView from '$lib/components/FavoriteView.svelte';
	import GetFavoritesButton from '$lib/components/GetFavoritesButton.svelte';
	import LoadingButton from '$lib/components/LoadingButton.svelte';
	import GetRandomPoemButton from '$lib/components/GetRandomPoemButton.svelte';
	import CreateFavoriteButton from '$lib/components/CreateFavoriteButton.svelte';
	import DeleteFavoriteButton from '$lib/components/DeleteFavoriteButton.svelte';
	import PoemView from '$lib/components/PoemView.svelte';
	import { mode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';

	// TODO: Updating unit tests

	const auth: Auth = getContext('auth');
	let loading = $state(false);
	let poem: Poem | undefined = $state(undefined);

	const fetchRandomPoem = async () => {
		auth.showFavorites = false;
		loading = true;
		try {
			poem = await getRandomPoem();
		} catch (error) {
			toast.error('Error fetching poem: ' + error);
		} finally {
			loading = false;
		}
	};

	const fetchPoemByTitleAndAuthor = async (author: string, title: string) => {
		auth.showFavorites = false;
		loading = true;
		try {
			poem = await getPoemByTitleAndAuthor(author, title);
		} catch (error) {
			toast.error('Error fetching poem: ' + error);
		} finally {
			loading = false;
		}
	};

	const fetchFavorites = async () => {
		const response = await fetch('/favorites/get-favorites');
		if (response.status !== 200) {
			toast.error('Error fetching favorites: ' + response.statusText);
		}
		const data = await response.json();
		favorites = data.favorites;
		if (favorites.length === 0) {
			toast.info('No favorites found');
		} else {
			toast.success('Favorites fetched successfully!');
		}
	};

	const postFavorite = async (author: string, title: string) => {
		const response = await fetch('/favorites/create-favorite', {
			method: 'POST',
			body: JSON.stringify({ author, title }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.status !== 201) {
			toast.error('Error creating favorite: ' + response.statusText);
		}
		await fetchFavorites();
		toast.success('Favorite created successfully!');
	};

	const removeFavorite = async (author: string, title: string) => {
		const response = await fetch('favorites/delete-favorite', {
			method: 'DELETE',
			body: JSON.stringify({ author, title }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.status !== 204) {
			toast.error('Error deleting favorite: ' + response.statusText);
		}
		await fetchFavorites();
		toast.success('Favorite deleted successfully!');
	};

	let favorites: Favorite[] = $state([]);
</script>

<main
	class="container m-auto flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-4rem)]"
>
	{#if poem}
		<div>
			<div class="flex flex-row gap-4 my-4">
				{#if loading}
					<LoadingButton label="Getting Another Poem" />
				{:else}
					<GetRandomPoemButton label="Read Another Poem" {fetchRandomPoem} />
					{#if auth.isLoggedIn}
						<GetFavoritesButton {auth} {fetchFavorites} />
					{/if}
				{/if}
			</div>
			{#if auth.showFavorites && favorites.length > 0}
				<div class="flex flex-col gap-4">
					{#each favorites as favorite}
						<FavoriteView {favorite} {fetchPoemByTitleAndAuthor} {removeFavorite} />
					{/each}
				</div>
			{:else}
				{#if auth.isLoggedIn}
					{#if favorites.some((favorite) => {
						if (poem === undefined) toast.error('No poem to favorite');
						else return favorite.author === poem.author && favorite.title === poem.title;
					})}
						<div class="my-2 p-2">
							<DeleteFavoriteButton {removeFavorite} author={poem.author} title={poem.title}>
								<Star class="h-6 w-6" fill={$mode === 'dark' ? '#fafafa' : '#18181b'} />
							</DeleteFavoriteButton>
						</div>
					{:else}
						<div class="my-2">
							<CreateFavoriteButton createFavorite={postFavorite} {poem}>
								<Star class="h-6 w-6" />
							</CreateFavoriteButton>
						</div>
					{/if}
				{/if}
				<PoemView {poem} />
			{/if}
		</div>
	{:else if loading}
		<LoadingButton label="Getting A Poem" />
	{:else}
		<GetRandomPoemButton label="Read A Poem" {fetchRandomPoem} />
		{#if auth.isLoggedIn}
			<GetFavoritesButton {auth} {fetchFavorites} />
			{#if auth.showFavorites && favorites.length > 0}
				<div class="flex flex-col gap-4">
					{#each favorites as favorite}
						<FavoriteView {favorite} {fetchPoemByTitleAndAuthor} {removeFavorite} />
					{/each}
				</div>
			{/if}
		{/if}
	{/if}
</main>
