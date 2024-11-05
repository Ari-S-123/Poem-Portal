import { describe, expect, it } from 'vitest';
import { getRandomPoem, getPoemByTitleAndAuthor } from '$lib/api/poetry';
import { DUMMY_FAVORITE_1 } from '../../test-dummies/favorites';

describe('getRandomPoem', () => {
	it('works without throwing an error', () => {
		expect(async () => {
			await getRandomPoem();
		}).not.toThrow();
	});
	it('returns a valid poem', async () => {
		const poem = await getRandomPoem();
		expect(poem).toBeDefined();
		expect(poem.title).toBeDefined();
		expect(poem.title).toBeTypeOf('string');
		expect(poem.title).not.toEqual('');
		expect(poem.author).toBeDefined();
		expect(poem.author).toBeTypeOf('string');
		expect(poem.author).not.toEqual('');
		expect(poem.lines).toBeDefined();
		expect(poem.lines.length).toBeGreaterThan(0);
	}, 10000);
});

describe('getPoemByTitleAndAuthor', () => {
	it('works without throwing an error', () => {
		expect(async () => {
			await getPoemByTitleAndAuthor(DUMMY_FAVORITE_1.author, DUMMY_FAVORITE_1.title);
		}).not.toThrow();
	});
	it('returns a valid poem', async () => {
		const poem = await getPoemByTitleAndAuthor(DUMMY_FAVORITE_1.author, DUMMY_FAVORITE_1.title);
		expect(poem).toBeDefined();
		expect(poem.title).toEqual(DUMMY_FAVORITE_1.title);
		expect(poem.author).toEqual(DUMMY_FAVORITE_1.author);
		expect(poem.lines).toBeDefined();
		expect(poem.lines.length).toBeGreaterThan(0);
	}, 10000);
});
