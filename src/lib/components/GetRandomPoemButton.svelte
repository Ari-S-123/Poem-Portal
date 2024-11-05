<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	interface GetRandomPoemButtonProps {
		label: string;
		fetchRandomPoem: () => Promise<void>;
	}

	let { label, fetchRandomPoem }: GetRandomPoemButtonProps = $props();
</script>

<Button aria-label="Gets a random poem for you to read" variant="outline" onclick={fetchRandomPoem}
	>{label}</Button
>
