<script lang="ts">
	import '../app.css';
	import { Moon, Sun } from 'lucide-svelte';
	import { resetMode, setMode, ModeWatcher } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<title>Poem Portal</title>
	<meta
		name="description"
		content="Poem Portal is an app that surprises poetry enthusiasts with a random poem."
	/>
</svelte:head>

<ModeWatcher />

<div class="min-h-screen transition-colors duration-300">
	<nav class="p-4 flex justify-end">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</nav>
	{@render children()}
</div>
