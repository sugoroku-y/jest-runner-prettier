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
        ${FAILURE_JSON}:4
               2 |        "abc": 123,
               3 |        "def": 234,
               4 | -      "ghi": 345
               4 | +    "ghi": 345
               5 |    }
               6 |    
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
               4 | -      "ghi": 345
               4 | +    "ghi": 345
               5 |    }
               6 |    
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
          ${FAILURE_JSON}:2
                 1 |    {
                 2 | -    "abc": 123,
                 2 | -    "def": 234,
                 2 | +      "abc": 123,
                 3 | +      "def": 234,
                 4 |      "ghi": 345
                 5 |    }
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
        ${SAMPLE_TS}:1
               1 | -  import * as fs from \"node:fs/promises\";
               1 | -  
               1 | -  (async () => {
               1 | -      const text = await fs.readFile(\"sample.json\", \"utf8\");
               1 | -      const json = JSON.parse(text) as Record<string, unknown>;
               1 | -      for (const [key, value] of Object.entries(json)) {
               1 | -          console.log(key, value);
               1 | -      }
               1 | -      console.log(${'`'}
               1 | -      '${'$'}{\"a\"}'
               1 | -      '${'$'}{\"b\"}'
               1 | -      '${'$'}{\"c\"}'
               1 | -      '${'$'}{\"d\"}'
               1 | -      '${'$'}{\"e\"}'
               1 | -      '${'$'}{\"f\"}'
               1 | -      '${'$'}{\"g\"}'
               1 | -      '${'$'}{\"h\"}'
               1 | -      '${'$'}{\"i\"}'
               1 | -      '${'$'}{\"j\"}'
        ...Too many differences for omission.
        `,
    );
  });
  test('sample.ts threshold infinity', async () => {
    const result = await runPrettierTest(
      SAMPLE_TS,
      PROJECT_DIR,
      {
        ...DEFAULT_CONFIG,
        diff: {
          ...DEFAULT_CONFIG.diff,
          thresholdForOmitting: 'Infinity',
        }
      },
    );
    expect(result.numPassingTests).toBe(0);
    expect(result.numFailingTests).toBe(1);
    expect(result.numPendingTests).toBe(0);
    expect(result.numTodoTests).toBe(0);
    expect(result.failureMessage).toEqual(
      expect.failureMessage`
        ${SAMPLE_TS}:1
               1 | -  import * as fs from \"node:fs/promises\";
               1 | -  
               1 | -  (async () => {
               1 | -      const text = await fs.readFile(\"sample.json\", \"utf8\");
               1 | -      const json = JSON.parse(text) as Record<string, unknown>;
               1 | -      for (const [key, value] of Object.entries(json)) {
               1 | -          console.log(key, value);
               1 | -      }
               1 | -      console.log(${'`'}
               1 | -      '${'$'}{\"a\"}'
               1 | -      '${'$'}{\"b\"}'
               1 | -      '${'$'}{\"c\"}'
               1 | -      '${'$'}{\"d\"}'
               1 | -      '${'$'}{\"e\"}'
               1 | -      '${'$'}{\"f\"}'
               1 | -      '${'$'}{\"g\"}'
               1 | -      '${'$'}{\"h\"}'
               1 | -      '${'$'}{\"i\"}'
               1 | -      '${'$'}{\"j\"}'
               1 | -      '${'$'}{\"k\"}'
               1 | -      '${'$'}{\"l\"}'
               1 | -      '${'$'}{\"m\"}'
               1 | -      '${'$'}{\"n\"}'
               1 | -      '${'$'}{\"o\"}'
               1 | -      '${'$'}{\"p\"}'
               1 | -      '${'$'}{\"q\"}'
               1 | -      '${'$'}{\"r\"}'
               1 | -      '${'$'}{\"s\"}'
               1 | -      '${'$'}{\"t\"}'
               1 | -      '${'$'}{\"u\"}'
               1 | -      '${'$'}{\"v\"}'
               1 | -      '${'$'}{\"w\"}'
               1 | -      '${'$'}{\"x\"}'
               1 | -      '${'$'}{\"y\"}'
               1 | -      '${'$'}{\"z\"}'
               1 | -      ${'`'});
               1 | +  import * as fs from 'node:fs/promises';
               2 | +  
               3 | +  (async () => {
               4 | +      const text = await fs.readFile('sample.json', 'utf8');
               5 | +      const json = JSON.parse(text) as Record<string, unknown>;
               6 | +      for (const [key, value] of Object.entries(json)) {
               7 | +          console.log(key, value);
               8 | +      }
               9 | +      console.log(${'`'}
              10 | +      '${'$'}{'a'}'
              11 | +      '${'$'}{'b'}'
              12 | +      '${'$'}{'c'}'
              13 | +      '${'$'}{'d'}'
              14 | +      '${'$'}{'e'}'
              15 | +      '${'$'}{'f'}'
              16 | +      '${'$'}{'g'}'
              17 | +      '${'$'}{'h'}'
              18 | +      '${'$'}{'i'}'
              19 | +      '${'$'}{'j'}'
              20 | +      '${'$'}{'k'}'
              21 | +      '${'$'}{'l'}'
              22 | +      '${'$'}{'m'}'
              23 | +      '${'$'}{'n'}'
              24 | +      '${'$'}{'o'}'
              25 | +      '${'$'}{'p'}'
              26 | +      '${'$'}{'q'}'
              27 | +      '${'$'}{'r'}'
              28 | +      '${'$'}{'s'}'
              29 | +      '${'$'}{'t'}'
              30 | +      '${'$'}{'u'}'
              31 | +      '${'$'}{'v'}'
              32 | +      '${'$'}{'w'}'
              33 | +      '${'$'}{'x'}'
              34 | +      '${'$'}{'y'}'
              35 | +      '${'$'}{'z'}'
              36 | +      ${'`'})
              37 |    })();
              38 | -  
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
