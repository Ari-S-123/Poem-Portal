<script lang="ts">
	import '../app.css';
	import { Moon, Sun, LogIn, LogOut, User } from 'lucide-svelte';
	import { resetMode, setMode, ModeWatcher } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { setContext, getContext } from 'svelte';
	import type { Auth } from '$lib/types/auth';

	let authState: Auth = $state({
		isLoggedIn: false,
		showFavorites: false,
		login: () => (authState.isLoggedIn = true),
		logout: () => {
			authState.isLoggedIn = false;
			authState.showFavorites = false;
		},
		username: 'Username'
	});

	setContext('auth', authState);

	const auth: Auth = getContext('auth');
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
	<nav class="p-4 flex gap-4 justify-end">
		{#if auth.isLoggedIn}
			<div class="flex flex-row justify-center items-center gap-4">
				<Avatar.Root data-testid="avatar">
					<Avatar.Fallback>
						<User />
					</Avatar.Fallback>
					<span class="sr-only">Avatar</span>
				</Avatar.Root>
				<p class="font-bold">Welcome, {auth.username}</p>
			</div>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="icon" onclick={auth.logout}>
						<LogOut class="h-4 w-4" />
						<span class="sr-only">Logout</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Logout</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{:else}
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="icon" onclick={auth.login}>
						<LogIn class="h-4 w-4" />
						<span class="sr-only">Login</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Login</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
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
	{@render children?.()}
</div>
