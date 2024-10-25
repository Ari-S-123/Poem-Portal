import { describe, expect, it } from 'vitest';
import { getRandomPoem } from '$lib/api/poetry';

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
