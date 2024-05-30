import { jest } from '@jest/globals';
import type { Config } from '@jest/types';
import JestRunnerPrettier from '../../src';
import { PROJECT_DIR, SAMPLE_TS, SUCCESS_JSON } from './constants';

describe('JestRunnerPrettier', () => {
    test.each([1, 2])('run', async (maxWorkers) => {
        process.chdir(PROJECT_DIR);
        const runner = new JestRunnerPrettier(
            { rootDir: PROJECT_DIR, maxWorkers } as Config.GlobalConfig,
            {},
        );
        const onStart = jest
            .fn<() => Promise<void>>()
            .mockReturnValue(Promise.resolve());
        const onResult = jest
            .fn<() => Promise<void>>()
            .mockReturnValue(Promise.resolve());
        const onFailure = jest
            .fn<() => Promise<void>>()
            .mockReturnValue(Promise.resolve());
        await runner.runTests(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return -- path以外は内部で使用していないのでダミーを指定
            [SUCCESS_JSON, SAMPLE_TS].map((path) => ({ path }) as any),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- 内部で使用していないのでダミーを指定
            {} as any,
            onStart,
            onResult,
            onFailure,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- 内部で使用していないのでダミーを指定
            {} as any,
        );
        expect(onStart).toHaveBeenCalledTimes(2);
        expect(onResult).toHaveBeenCalledTimes(2);
        // どっちが先に呼ばれるか分からないのでarrayContainingで
        expect(onResult.mock.calls).toEqual(
            expect.arrayContaining([
                // sample.tsはfailed
                [
                    expect.objectContaining({
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- テスト用
                        path: expect.stringContaining('sample.ts'),
                    }),
                    expect.objectContaining({
                        testResults: [
                            expect.objectContaining({ status: 'failed' }),
                        ],
                    }),
                ],
                // success.jsonはpassed
                [
                    expect.objectContaining({
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- テスト用
                        path: expect.stringContaining('success.json'),
                    }),
                    expect.objectContaining({
                        testResults: [
                            expect.objectContaining({ status: 'passed' }),
                        ],
                    }),
                ],
            ]),
        );
        expect(onFailure).toHaveBeenCalledTimes(0);
    });
});
