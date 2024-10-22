import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: { fontFamily: { sans: ['Geist', 'Inter', 'sans-serif'] } }
	},

	plugins: [typography, forms]
} as Config;
