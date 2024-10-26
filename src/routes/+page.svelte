<script lang="ts">
	import type { Poem } from '$lib/types/poem';
	import { getRandomPoem } from '$lib/api/poetry';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let loading = $state(false);
	let error: string | undefined = $state(undefined);
	let poem: Poem | undefined = $state(undefined);

	const fetchPoem = async () => {
		loading = true;
		try {
			poem = await getRandomPoem();
		} catch (error) {
			console.error('Error fetching poem:', error);
		} finally {
			loading = false;
		}
	};
</script>

<main class="container m-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
	{#if error}
		<p class="text-red-500 mb-4">{error}</p>
	{/if}
	{#if poem}
		<div>
			{#if loading}
				<Button disabled class="my-4 cursor-not-allowed">
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					Getting Another Poem
				</Button>
			{:else}
				<Button
					variant="outline"
					onclick={fetchPoem}
					class="my-4 hover:scale-105 transition-all ease-in-out duration-300"
				>
					Read Another
				</Button>
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
		</div>
	{:else if loading}
		<Button disabled class="cursor-not-allowed">
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			Getting A Poem
		</Button>
	{:else}
		<Button
			variant="outline"
			onclick={fetchPoem}
			class="hover:scale-105 transition-all ease-in-out duration-300"
		>
			Read A Poem
		</Button>
	{/if}
</main>
