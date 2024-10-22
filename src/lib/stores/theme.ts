import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function isTheme(value: string | null): value is Theme {
	return value === 'light' || value === 'dark';
}

function getInitialTheme(): Theme {
	if (!browser) return 'light';

	const storedTheme = window.localStorage.getItem('theme');
	if (isTheme(storedTheme)) return storedTheme;

	// If no theme is stored or invalid theme, check system preference
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	return prefersDark ? 'dark' : 'light';
}

export const theme = writable<Theme>(getInitialTheme());

theme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('theme', value);
		if (value === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
});
