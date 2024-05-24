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
        ${FAILURE_JSON}:4:3
               2 |        "abc": 123,
               3 |        "def": 234,
         4-      | !!   "ghi": 345,
             -10 | !!   "jkl": 456,
                 | !!   "mno": 567,
                 | !!   "pqr": 678,
                 | !!   "stu": 789,
                 | !!   "vwx": 890,
                 | !!   "yz": 901
                 | =>     "ghi": 345,
                 | =>     "jkl": 456,
                 | =>     "mno": 567,
                 | =>     "pqr": 678,
                 | =>     "stu": 789,
                 | =>     "vwx": 890,
                 | =>     "yz": 901
              11 |    }
              12 | => 
        `,
    );
  });
  test('failure.json expand', async () => {
    const result = await runPrettierTest(FAILURE_JSON, FAILURE_DIR, {
      ...DEFAULT_CONFIG,
      diff: { expand: true, contextLines: 2, thresholdForOmitting: 20 },
    });
    expect(result.numPassingTests).toBe(0);
    expect(result.numFailingTests).toBe(1);
    expect(result.numPendingTests).toBe(0);
    expect(result.numTodoTests).toBe(0);
    expect(result.failureMessage).toEqual(
      expect.failureMessage`
        ${FAILURE_JSON}
               1 |    {
               2 |        "abc": 123,
               3 |        "def": 234,
         4-      | !!   "ghi": 345,
             -10 | !!   "jkl": 456,
                 | !!   "mno": 567,
                 | !!   "pqr": 678,
                 | !!   "stu": 789,
                 | !!   "vwx": 890,
                 | !!   "yz": 901
                 | =>     "ghi": 345,
                 | =>     "jkl": 456,
                 | =>     "mno": 567,
                 | =>     "pqr": 678,
                 | =>     "stu": 789,
                 | =>     "vwx": 890,
                 | =>     "yz": 901
              11 |    }
              12 | => 
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
          ${FAILURE_JSON}:2:3
                 1 |    {
           2-      | !!     "abc": 123,
                -3 | !!     "def": 234,
                   | =>   "abc": 123,
                   | =>   "def": 234,
                 4 |      "ghi": 345,
                 5 |      "jkl": 456,
          ${FAILURE_JSON}:12:1
                10 |      "yz": 901
                11 |    }
                12 | => 
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
      expect.failureMessage`
        ${SAMPLE_TS}:1:40
         1-      | !! import * as fs from 'node:fs/promises';
             -36 | !! 
                 | !! (async () => {
                 | !!     const text = await fs.readFile('sample.json', 'utf8');
                 | !!     const json = JSON.parse(text) as Record<string, unknown>;
                 | !!     for (const [key, value] of Object.entries(json)) {
                 | !!         console.log(key, value);
                 | !!     }
                 | !!     console.log(${'`'}
                 | !!     '${'$'}{'a'}'
                 | !!     '${'$'}{'b'}'
                 | !!     '${'$'}{'c'}'
                 | !!     '${'$'}{'d'}'
                 | !!     '${'$'}{'e'}'
                 | !!     '${'$'}{'f'}'
                 | !!     '${'$'}{'g'}'
                 | !!     '${'$'}{'h'}'
                 | !!     '${'$'}{'i'}'
                 | !!     '${'$'}{'j'}'
        ...Too many modifications to show all.
        `,
    );
  });
  test('sample.ts threshold infinity', async () => {
    const result = await runPrettierTest(SAMPLE_TS, PROJECT_DIR, {
      ...DEFAULT_CONFIG,
      diff: {
        ...DEFAULT_CONFIG.diff,
        thresholdForOmitting: 'Infinity',
      },
    });
    expect(result.numPassingTests).toBe(0);
    expect(result.numFailingTests).toBe(1);
    expect(result.numPendingTests).toBe(0);
    expect(result.numTodoTests).toBe(0);
    expect(result.failureMessage).toEqual(
      expect.failureMessage`
        ${SAMPLE_TS}:1:40
         1-      | !! import * as fs from 'node:fs/promises';
             -36 | !! 
                 | !! (async () => {
                 | !!     const text = await fs.readFile('sample.json', 'utf8');
                 | !!     const json = JSON.parse(text) as Record<string, unknown>;
                 | !!     for (const [key, value] of Object.entries(json)) {
                 | !!         console.log(key, value);
                 | !!     }
                 | !!     console.log(${'`'}
                 | !!     '${'$'}{'a'}'
                 | !!     '${'$'}{'b'}'
                 | !!     '${'$'}{'c'}'
                 | !!     '${'$'}{'d'}'
                 | !!     '${'$'}{'e'}'
                 | !!     '${'$'}{'f'}'
                 | !!     '${'$'}{'g'}'
                 | !!     '${'$'}{'h'}'
                 | !!     '${'$'}{'i'}'
                 | !!     '${'$'}{'j'}'
                 | !!     '${'$'}{'k'}'
                 | !!     '${'$'}{'l'}'
                 | !!     '${'$'}{'m'}'
                 | !!     '${'$'}{'n'}'
                 | !!     '${'$'}{'o'}'
                 | !!     '${'$'}{'p'}'
                 | !!     '${'$'}{'q'}'
                 | !!     '${'$'}{'r'}'
                 | !!     '${'$'}{'s'}'
                 | !!     '${'$'}{'t'}'
                 | !!     '${'$'}{'u'}'
                 | !!     '${'$'}{'v'}'
                 | !!     '${'$'}{'w'}'
                 | !!     '${'$'}{'x'}'
                 | !!     '${'$'}{'y'}'
                 | !!     '${'$'}{'z'}'
                 | !!     ${'`'})
                 | => import * as fs from 'node:fs/promises';
                 | => 
                 | => (async () => {
                 | =>     const text = await fs.readFile('sample.json', 'utf8');
                 | =>     const json = JSON.parse(text) as Record<string, unknown>;
                 | =>     for (const [key, value] of Object.entries(json)) {
                 | =>         console.log(key, value);
                 | =>     }
                 | =>     console.log(${'`'}
                 | =>     '${'$'}{'a'}'
                 | =>     '${'$'}{'b'}'
                 | =>     '${'$'}{'c'}'
                 | =>     '${'$'}{'d'}'
                 | =>     '${'$'}{'e'}'
                 | =>     '${'$'}{'f'}'
                 | =>     '${'$'}{'g'}'
                 | =>     '${'$'}{'h'}'
                 | =>     '${'$'}{'i'}'
                 | =>     '${'$'}{'j'}'
                 | =>     '${'$'}{'k'}'
                 | =>     '${'$'}{'l'}'
                 | =>     '${'$'}{'m'}'
                 | =>     '${'$'}{'n'}'
                 | =>     '${'$'}{'o'}'
                 | =>     '${'$'}{'p'}'
                 | =>     '${'$'}{'q'}'
                 | =>     '${'$'}{'r'}'
                 | =>     '${'$'}{'s'}'
                 | =>     '${'$'}{'t'}'
                 | =>     '${'$'}{'u'}'
                 | =>     '${'$'}{'v'}'
                 | =>     '${'$'}{'w'}'
                 | =>     '${'$'}{'x'}'
                 | =>     '${'$'}{'y'}'
                 | =>     '${'$'}{'z'}'
                 | =>     ${'`'});
              37 |    })();
              38 | => 
        `,
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
    if (expected !== actual) {
      console.error(
        this.utils.diff(expected, actual, { expand: false, contextLines: 2 }),
      );
    }
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
