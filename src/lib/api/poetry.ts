import type { Poem } from '$lib/types/poem';

/**
 * Fetch a random poem from the PoetryDB API
 * @returns {Promise<Poem>} A promise that resolves to a random poem
 * @throws {Error} If the request fails
 * @example
 * const poem = await getRandomPoem();
 * console.log(poem.title, poem.author, poem.lines);
 * // "The Raven" "Edgar Allan Poe" ["Once upon a midnight dreary...", ...]
 * @see https://poetrydb.org/index.html#random
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
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

/**
 * Fetch a poem with a specific title and author from the PoetryDB API
 * @param {string} author The author of the poem
 * @param {string} title The title of the poem
 * @returns {Promise<Poem>} A promise that resolves to a specific poem
 * @throws {Error} If the request fails
 * @example
 * const poem = await getPoemByTitleAndAuthor();
 * console.log(poem.title, poem.author, poem.lines);
 * // "The Raven" "Edgar Allan Poe" ["Once upon a midnight dreary...", ...]
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export const getPoemByTitleAndAuthor = async (author: string, title: string): Promise<Poem> => {
	try {
		const response = await fetch(`https://poetrydb.org/author,title/${author};${title}`);
		const [poem] = await response.json();
		return poem;
	} catch (error) {
		console.error('Error fetching poem:', error);
		throw error;
	}
};
