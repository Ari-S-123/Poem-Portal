<script lang="ts">
	import '../app.css';
	import { Moon, Sun } from 'lucide-svelte';
	import { toggleMode, ModeWatcher } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children } = $props();
</script>

<div class="min-h-screen transition-colors duration-300">
	<ModeWatcher />
	<nav class="p-4 flex justify-end">
		<Button
			onclick={toggleMode}
			variant="ghost"
			size="icon"
			class="hover:scale-105 transition-all ease-in-out duration-300"
		>
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</nav>
	{@render children()}
</div>
