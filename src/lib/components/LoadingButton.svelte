<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	interface LoadingButtonProps {
		label: string;
	}

	let { label }: LoadingButtonProps = $props();
</script>

<Button aria-label="Loading" disabled class="cursor-not-allowed">
	<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
	{label}
</Button>
