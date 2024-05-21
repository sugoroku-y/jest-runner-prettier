import { jest as jest2 } from '@jest/globals';
import * as prettier from 'prettier';
import { runPrettierTest } from '../../src/jest-runner-prettier/runPrettierTest';
import {
  SUCCESS_JSON,
  PROJECT_DIR,
  DEFAULT_CONFIG,
  FAILURE_JSON,
  FAILURE_DIR,
  SAMPLE_TS,
} from './constants';

describe('runPrettierTest', () => {
  test('success.json', async () => {
    const result = await runPrettierTest(
      SUCCESS_JSON,
      PROJECT_DIR,
      DEFAULT_CONFIG,
    );
    expect(result.numPassingTests).toBe(1);
    expect(result.numFailingTests).toBe(0);
    expect(result.numPendingTests).toBe(0);
    expect(result.numTodoTests).toBe(0);
    expect(result.failureMessage).toBeUndefined();
  });
  test('failure.json', async () => {
    const result = await runPrettierTest(
      FAILURE_JSON,
      FAILURE_DIR,
      DEFAULT_CONFIG,
    );
    expect(result.numPassingTests).toBe(0);
    expect(result.numFailingTests).toBe(1);
    expect(result.numPendingTests).toBe(0);
    expect(result.numTodoTests).toBe(0);
    expect(result.failureMessage).toEqual(
      expect.failureMessage`
      - Expected
      + Received

      @@ -2,5 +2,5 @@
            "abc": 123,
            "def": 234,
      -     "ghi": 345
      +   "ghi": 345
        }

      `,
    );
  });
  test('empty config file', async () => {
    // getPrettierConfigSearchStopDirectoryをモックして.prettierrcを見つけられなくする
    const mock = jest2
      .spyOn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- prettier内部関数のモック
        (prettier as any).__internal.mockable,
        'getPrettierConfigSearchStopDirectory',
      )
      .mockReturnValue(FAILURE_DIR);
    try {
      const result = await runPrettierTest(
        FAILURE_JSON,
        FAILURE_DIR,
        DEFAULT_CONFIG,
      );
      expect(result.numPassingTests).toBe(0);
      expect(result.numFailingTests).toBe(1);
      expect(result.numPendingTests).toBe(0);
      expect(result.numTodoTests).toBe(0);
      expect(result.failureMessage).toEqual(
        expect.failureMessage`
          - Expected
          + Received

          @@ -1,5 +1,5 @@
            {
          -   "abc": 123,
          -   "def": 234,
          +     "abc": 123,
          +     "def": 234,
              "ghi": 345
            }
          `,
      );
    } finally {
      mock?.mockRestore();
    }
  });
  test('sample.ts', async () => {
    const result = await runPrettierTest(
      SAMPLE_TS,
      PROJECT_DIR,
      DEFAULT_CONFIG,
    );
    expect(result.numPassingTests).toBe(0);
    expect(result.numFailingTests).toBe(1);
    expect(result.numPendingTests).toBe(0);
    expect(result.numTodoTests).toBe(0);
    expect(result.failureMessage).toEqual(
      expect.failureMessage`Too many differences for omission.`,
    );
  });
});

expect.extend({
  failureMessage(
    received: string,
    ...args: [TemplateStringsArray, ...unknown[]]
  ): jest.CustomMatcherResult {
    const [template] = args;
    const indent =
      template[template.length - 1].match(
        /(?<=\r\n|[\r\n\u2028\u2029])[ \t]*$/,
      )?.[0] ?? '';
    const expected = template
      .map((s, i) => {
        const pattern = `${i === template.length - 1 ? `(?:\r\n|[\r\n\u2028\u2029])${indent}$|` : ''}(?:${i === 0 ? '^(?:\r\n|[\r\n\u2028\u2029])|' : ''}(?<=\r\n|[\r\n\u2028\u2029]))${indent}`;
        const re = new RegExp(pattern, 'g');
        return s.replace(re, '');
      })
      .reduce((r, e, i) => `${r}${args[i]}${e}`)
      .replace(/(?:\r\n|[\r\n\u2028\u2029])/g, '\n');
    const actual = received
      .replace(
        // eslint-disable-next-line no-control-regex -- エスケープシーケンスの除去
        /(?:\x1b\[(?:\d+(?:;\d+)*)? ?[A-Z])*/gi,
        '',
      )
      .replace(/\r\n|[\r\n\u2028\u2029]/g, '\n');
    return {
      pass: expected === actual,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- asymmetric matcherではmessageを使用しない
      message: undefined!,
    };
  },
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- jestの拡張
  namespace jest {
    interface Expect {
      failureMessage(...args: [TemplateStringsArray, ...unknown[]]): string;
    }
  }
}
