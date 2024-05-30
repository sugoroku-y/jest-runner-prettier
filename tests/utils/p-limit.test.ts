import { pLimit } from '../../src/utils/p-limit';

describe('p-limit', () => {
    test('success ony', async () => {
        const limit = pLimit(5);
        const result = await Promise.allSettled(
            Array.from({ length: 10 }, (_, i) =>
                limit(() => new Promise<number>((r) => setTimeout(r, 100, i))),
            ),
        );
        expect(result).toEqual(
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
                status: 'fulfilled',
                value: i,
            })),
        );
    });
    test.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])(
        '9 successes and 1 error: #%i',
        async (errorIndex) => {
            const limit = pLimit(5);
            const result = await Promise.allSettled(
                Array.from({ length: 10 }, (_, i) =>
                    limit(async () => {
                        await new Promise((r) => setTimeout(r, 100));
                        if (i === errorIndex) {
                            throw new Error('abort');
                        }
                        return i;
                    }),
                ),
            );
            expect(result).toEqual(
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) =>
                    i === errorIndex
                        ? { status: 'rejected', reason: new Error('abort') }
                        : { status: 'fulfilled', value: i },
                ),
            );
        },
    );
});
