<script lang="ts">
	import '../app.css';
	import { Moon, Sun } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme';

	function toggleTheme() {
		theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
	}

	let { children } = $props();
</script>

<div
	class={`min-h-screen transition-colors duration-300 ${$theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
>
	<nav class="p-4 flex justify-end">
		<button
			onclick={toggleTheme}
			class={`p-2 rounded-full hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black`}
			aria-label="Toggle theme"
		>
			{#if $theme === 'dark'}
				<Sun class="w-6 h-6" />
			{:else}
				<Moon class="w-6 h-6" />
			{/if}
		</button>
	</nav>
	{@render children()}
</div>
