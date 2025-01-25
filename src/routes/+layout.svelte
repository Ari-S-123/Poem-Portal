<script lang="ts">
	import '../app.css';
	import { Moon, Sun, LogIn, LogOut, User } from 'lucide-svelte';
	import { resetMode, setMode, ModeWatcher } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { setContext, getContext } from 'svelte';
	import type { Auth } from '$lib/types/auth';
	import { goto, invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Separator } from '$lib/components/ui/separator/index';

	const { data: propsData, children } = $props();

	const { supabase, session, user } = propsData;

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	let authState: Auth = $state({
		isLoggedIn: user !== null,
		showFavorites: false,
		username:
			user?.user_metadata.preferred_username ??
			user?.user_metadata.user_name ??
			user?.user_metadata.name
	});

	setContext('auth', authState);

	const auth: Auth = getContext('auth');
</script>

<svelte:head>
	<title>Poem Portal</title>
	<meta
		name="description"
		content="Poem Portal is an app that surprises poetry enthusiasts with a random poem."
	/>
</svelte:head>

<ModeWatcher />
<Toaster />

<div class="min-h-screen transition-colors duration-300">
	<nav class="p-4 flex gap-4 justify-between">
		<h1 class="text-5xl font-extrabold flex items-center">📖Poem Portal</h1>
		<div class="p-4 flex gap-4">
			{#if auth.isLoggedIn}
				<div class="flex flex-row justify-center items-center gap-4">
					<Avatar.Root data-testid="avatar">
						<Avatar.Image src={user?.user_metadata.avatar_url} alt="GitHub Profile Picture" />
						<Avatar.Fallback>
							<User />
						</Avatar.Fallback>
						<span class="sr-only">Avatar</span>
					</Avatar.Root>
					<p class="font-bold">Welcome, {auth.username}</p>
				</div>
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div>
								<Button variant="outline" size="icon" href="/auth/logout">
									<LogOut class="h-4 w-4" />
									<span class="sr-only">Logout</span>
								</Button>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Logout</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			{:else}
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div>
								<Button variant="outline" size="icon" href="/auth/login/github">
									<LogIn class="h-4 w-4" />
									<span class="sr-only">Login with GitHub</span>
								</Button>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Login with GitHub</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			{/if}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item class="cursor-pointer" onclick={() => setMode('light')}
							>Light
						</DropdownMenu.Item>
						<DropdownMenu.Item class="cursor-pointer" onclick={() => setMode('dark')}
							>Dark
						</DropdownMenu.Item>
						<DropdownMenu.Item class="cursor-pointer" onclick={() => resetMode()}
							>System
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Button
				target="_blank"
				rel="noreferrer noopener"
				href="https://github.com/Ari-S-123/Poem-Portal"
				size="icon"
				variant="outline"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-github"
				>
					<path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
					/>
					<path d="M9 18c-4.51 2-5-2-7-2" />
				</svg>
			</Button>
		</div>
	</nav>
	<Separator />
	{@render children?.()}
</div>
