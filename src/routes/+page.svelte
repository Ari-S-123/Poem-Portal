<script lang="ts">
	import type { Poem } from '$lib/types/poem';
	import { getRandomPoem, getPoemByTitleAndAuthor } from '$lib/api/poetry';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Trash from 'lucide-svelte/icons/trash';
	import Star from 'lucide-svelte/icons/star';
	import { getContext } from 'svelte';
	import type { Auth } from '$lib/types/auth';
	import type { Favorite } from '$lib/types/favorite';

	// TODO: Lots of frontend refactoring and updating tests

	const auth: Auth = getContext('auth');
	let loading = $state(false);
	let error: string | undefined = $state(undefined);
	let poem: Poem | undefined = $state(undefined);

	const fetchRandomPoem = async () => {
		auth.showFavorites = false;
		loading = true;
		try {
			poem = await getRandomPoem();
		} catch (error) {
			console.error('Error fetching poem:', error);
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
			console.error('Error fetching poem:', error);
		} finally {
			loading = false;
		}
	};

	const fetchFavorites = async () => {
		const response = await fetch('/favorites/get-favorites');
		if (response.status !== 200) {
			console.error('Error fetching favorites:', response.statusText);
			error = 'Error fetching favorites';
			return;
		}
		const data = await response.json();
		favorites = data.favorites;
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
			console.error('Error creating favorite:', response.statusText);
			error = 'Error creating favorite';
		}
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
			console.error('Error deleting favorite:', response.statusText);
			error = 'Error deleting favorite';
		}
	};

	let favorites: Favorite[] = $state([]);
</script>

<main
	class="container m-auto flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-4rem)]"
>
	{#if error}
		<p class="text-red-500 mb-4">{error}</p>
	{/if}
	{#if poem}
		<div>
			<div class="flex flex-row gap-4 my-4">
				{#if loading}
					<Button disabled class="cursor-not-allowed">
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Getting Another Poem
					</Button>
				{:else}
					<Button variant="outline" onclick={fetchRandomPoem}>Read Another</Button>
					{#if auth.isLoggedIn}
						<Button
							variant="outline"
							onclick={async () => {
								if (!auth.showFavorites) await fetchFavorites();
								auth.showFavorites = !auth.showFavorites;
							}}
							>Favorites
						</Button>
					{/if}
				{/if}
			</div>
			{#if auth.showFavorites && favorites.length > 0}
				<div class="flex flex-col gap-4">
					{#each favorites as favorite}
						<div class="flex flex-row items-center justify-center">
							<Button
								variant="outline"
								size="lg"
								class="p-8 flex flex-row justify-between"
								onclick={() => {
									fetchPoemByTitleAndAuthor(favorite.author, favorite.title);
								}}
							>
								<div class="flex flex-col gap-2">
									<b>{favorite.title}</b>
									<i>by {favorite.author}</i>
								</div>
							</Button>
							<Trash
								class="h-8 w-8 m-4 text-red-700 hover:fill-red-700 hover:cursor-pointer"
								onclick={() => removeFavorite(favorite.author, favorite.title)}
							/>
						</div>
					{/each}
				</div>
			{:else}
				{#if auth.isLoggedIn}
					{#if favorites.some((favorite) => {
						if (poem === undefined) console.error('No poem to favorite');
						else return favorite.author === poem.author && favorite.title === poem.title;
					})}
						<Star
							class="h-8 w-8 my-4 text-yellow-400 fill-yellow-400 hover:fill-background hover:cursor-pointer"
							onclick={() => {
								if (poem === undefined) console.error('No poem to delete');
								else removeFavorite(poem.author, poem.title);
							}}
						/>
					{:else}
						<Star
							class="h-8 w-8 my-4 text-yellow-400 hover:fill-yellow-400 hover:cursor-pointer"
							onclick={() => {
								if (poem === undefined) console.error('No poem to favorite');
								else postFavorite(poem.author, poem.title);
							}}
						/>
					{/if}
				{/if}
				<article class="mb-8">
					<h1 class="text-2xl font-bold mb-2">{poem.title}</h1>
					<h2 class="text-xl italic mb-4">by {poem.author}</h2>
					<div class="space-y-2">
						{#each poem.lines as line}
							<p class="whitespace-pre-wrap">{line}</p>
						{/each}
					</div>
				</article>
			{/if}
		</div>
	{:else if loading}
		<Button disabled class="cursor-not-allowed">
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			Getting A Poem
		</Button>
	{:else}
		<Button variant="outline" onclick={fetchRandomPoem}>Read A Poem</Button>
		{#if auth.isLoggedIn}
			<Button
				variant="outline"
				onclick={async () => {
					if (!auth.showFavorites) await fetchFavorites();
					auth.showFavorites = !auth.showFavorites;
				}}
				>Favorites
			</Button>
			{#if auth.showFavorites && favorites.length > 0}
				<div class="flex flex-col gap-4">
					{#each favorites as favorite}
						<div class="flex flex-row items-center justify-center">
							<Button
								variant="outline"
								size="lg"
								class="p-8 flex flex-row justify-between"
								onclick={() => {
									fetchPoemByTitleAndAuthor(favorite.author, favorite.title);
								}}
							>
								<div class="flex flex-col gap-2">
									<b>{favorite.title}</b>
									<i>by {favorite.author}</i>
								</div>
							</Button>
							<Trash
								class="h-8 w-8 m-4 text-red-700 hover:fill-red-700 hover:cursor-pointer"
								onclick={() => removeFavorite(favorite.author, favorite.title)}
							/>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	{/if}
</main>
