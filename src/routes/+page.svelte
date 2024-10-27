<script lang="ts">
	import type { Poem } from '$lib/types/poem';
	import { getRandomPoem, getPoemByTitleAndAuthor } from '$lib/api/poetry';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { getContext } from 'svelte';
	import type { Auth } from '$lib/types/auth';
	import { DUMMY_FAVORITE_1, DUMMY_FAVORITE_2 } from '../tests/test-dummies/favorites';

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

	const favorites = [DUMMY_FAVORITE_1, DUMMY_FAVORITE_2];
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
							>Favorites</Button
						>
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
								<b>{favorite.title}</b>
								<i>by {favorite.author}</i>
							</div>
						</Button>
					{/each}
				</div>
			{:else}
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
				>Favorites</Button
			>
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
