import type { Poem } from '$lib/types/poem';

export const getRandomPoem = async (): Promise<Poem> => {
	try {
		const response = await fetch('https://poetrydb.org/random');
		const [poem] = await response.json();
		return poem;
	} catch (error) {
		console.error('Error fetching poem:', error);
		throw error;
	}
};
