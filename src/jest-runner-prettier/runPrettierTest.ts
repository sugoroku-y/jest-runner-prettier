import { readFile } from 'fs/promises';
import { type TestResult } from '@jest/test-result';
import { diff } from 'jest-diff';
import { resolveConfig, check, format } from 'prettier';
import { TestResultFactory } from './TestResultFactory.js';
import type { RunnerConfig } from './loadRunnerConfig';

export async function runPrettierTest(
  testPath: string,
  rootDir: string,
  runnerConfig: RunnerConfig,
): Promise<TestResult> {
  const {
    config,
    diff: { expand, contextLines },
  } = runnerConfig;
  const contents = await readFile(testPath, 'utf8');

  const prettierConfig = (await resolveConfig(testPath, { config })) ?? {};
  prettierConfig.filepath = testPath;

  const factory = new TestResultFactory(testPath, rootDir);
  const isPretty = await check(contents, prettierConfig);
  if (isPretty) {
    return factory.pass();
  }
  const formatted = await format(contents, prettierConfig);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ここではnullishにならないはず
  const errorMessage = diff(formatted, contents, { expand, contextLines })!;
  return factory.fail(errorMessage);
}
