<script lang="ts">
	import type { Poem } from '$lib/types/poem';
	import { getRandomPoem } from '$lib/api/poetry';

	let loading = false;
	let error: string | null = null;
	let poem: Poem | null = null;

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

<main class="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
	{#if error}
		<p class="text-red-500 mb-4">{error}</p>
	{/if}
	{#if poem}
		<div>
			<button
				onclick={fetchPoem}
				disabled={loading}
				class="button dark:border-white hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
			>
				{loading ? 'Loading...' : 'Read Another'}
			</button>
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
	{:else}
		<button
			onclick={fetchPoem}
			disabled={loading}
			class="button dark:border-white hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
		>
			{loading ? 'Loading...' : 'Read A Poem'}
		</button>
	{/if}
</main>
