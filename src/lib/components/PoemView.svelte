<script lang="ts">
	import type { Poem } from '$lib/types/poem';

	interface PoemViewProps {
		poem: Poem;
	}

	let { poem }: PoemViewProps = $props();
</script>

<article aria-label="The poem that was fetched" class="mb-8">
	<h1 class="text-2xl font-bold mb-2">{poem.title}</h1>
	<h2 class="text-xl italic mb-4">by {poem.author}</h2>
	<div class="space-y-2">
		{#each poem.lines as line}
			<p class="whitespace-pre-wrap">{line}</p>
		{/each}
	</div>
</article>
