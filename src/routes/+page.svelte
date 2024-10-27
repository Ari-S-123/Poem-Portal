<script lang="ts">
	import type { Poem } from '$lib/types/poem';
	import { getRandomPoem, getPoemByTitleAndAuthor } from '$lib/api/poetry';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Trash from 'lucide-svelte/icons/trash';
	import Star from 'lucide-svelte/icons/star';
	import { getContext } from 'svelte';
	import type { Auth } from '$lib/types/auth';
	import { deleteFavorite, getOrCreateFavorite } from '$lib/db';

	// TODO: Move deleteFavorite, getOrCreateFavorite usages to server-side and update tests


	const { data } = $props();

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

	const favorites = $state(data.favorites);
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
						<Button variant="outline" onclick={() => (auth.showFavorites = !auth.showFavorites)}
							>Favorites
						</Button>
					{/if}
				{/if}
			</div>
			{#if auth.showFavorites}
				<div class="flex flex-col gap-4">
					{#each favorites as favorite}
						<Button
							variant="outline"
							size="lg"
							class="p-8"
							onclick={() => {
								fetchPoemByTitleAndAuthor(favorite.author, favorite.title);
							}}
						>
							<div class="flex flex-col gap-2">
								<div class="flex flex-row gap-1">
									<Trash
										class="h-4 w-4 m-4"
										onclick={() => {
											deleteFavorite(auth.user_id, favorite.author, favorite.title);
										}}
									/>
								</div>
								<b>{favorite.title}</b>
								<i>by {favorite.author}</i>
							</div>
						</Button>
					{/each}
				</div>
			{:else}
				{#if auth.isLoggedIn}
					<Star
						class="h-4 w-4 my-4"
						onclick={() => {
							if (poem === undefined) console.error('No poem to favorite');
							else getOrCreateFavorite(auth.user_id, poem.author, poem?.title);
						}}
					/>
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
			<Button variant="outline" onclick={() => (auth.showFavorites = !auth.showFavorites)}
				>Favorites
			</Button>
			{#if auth.showFavorites}
				<div class="flex flex-col gap-4">
					{#each favorites as favorite}
						<Button
							variant="outline"
							size="lg"
							class="p-8"
							onclick={() => {
								fetchPoemByTitleAndAuthor(favorite.author, favorite.title);
							}}
						>
							<div class="flex flex-col gap-2">
								<Trash
									class="h-4 w-4 m-4"
									onclick={() => {
										deleteFavorite(auth.user_id, favorite.author, favorite.title);
									}}
								/>
								<b>{favorite.title}</b>
								<i>by {favorite.author}</i>
							</div>
						</Button>
					{/each}
				</div>
			{/if}
		{/if}
	{/if}
</main>
