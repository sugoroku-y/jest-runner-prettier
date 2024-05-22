import { readFile } from 'fs/promises';
import { type TestResult } from '@jest/test-result';
import chalk from 'chalk';
import {
  diffLinesRaw,
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT,
  type Diff,
} from 'jest-diff';
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
    diff: { thresholdForOmitting },
  } = runnerConfig;
  const threshold =
    typeof thresholdForOmitting === 'number' ? thresholdForOmitting : Infinity;
  const contents = await readFile(testPath, 'utf8');

  const prettierConfig = (await resolveConfig(testPath, { config })) ?? {};
  prettierConfig.filepath = testPath;

  const factory = new TestResultFactory(testPath, rootDir);
  const isPretty = await check(contents, prettierConfig);
  if (isPretty) {
    return factory.pass();
  }
  const formatted = await format(contents, prettierConfig);
  const errorMessages = prettierModification(
    testPath,
    formatted,
    contents,
    runnerConfig,
  );
  const errorMessage = (
    errorMessages.length > threshold
      ? errorMessages
          .slice(0, threshold)
          .concat(`...Too many differences for omission.`)
      : errorMessages
  ).join('\n');
  return factory.fail(errorMessage);
}

function prettierModification(
  testPath: string,
  formatted: string,
  contents: string,
  { diff: { expand, contextLines } }: RunnerConfig,
): string[] {
  const formattedLines = formatted.split('\n');
  const contentsLines = contents.split('\n');
  const diffs = diffLinesRaw(formattedLines, contentsLines);
  let lineNo = 0;
  const lineNos = diffs.map(({ 0: op }) =>
    op === DIFF_DELETE ? lineNo + 1 : (lineNo += 1),
  );
  if (expand) {
    return [chalk.underline(testPath)].concat(
      ...diffs.map((diff, index) => printDiff(diff, lineNos[index])),
    );
  }
  const visibles = Array<boolean>(diffs.length);
  for (const [i, { 0: op }] of diffs.entries()) {
    if (op === DIFF_EQUAL) {
      continue;
    }
    const start = Math.max(0, i - contextLines);
    const end = Math.min(diffs.length - 1, i + contextLines);
    for (let index = start; index <= end; index += 1) {
      visibles[index] = true;
    }
  }
  return [
    ...(function* () {
      for (const [index, diff] of diffs.entries()) {
        if (!visibles[index]) {
          continue;
        }
        if (!visibles[index - 1]) {
          const diffIndex = diffs.findIndex(
            ({ 0: op }, i) => i >= index && op !== DIFF_EQUAL,
          );
          yield `${chalk.underline(`${testPath}:${lineNos[diffIndex]}`)}`;
        }
        yield printDiff(diff, lineNos[index]);
      }
    })(),
  ];
}

const DIFF_MAP = {
  [DIFF_EQUAL]: ['dim', ' '],
  [DIFF_DELETE]: ['red', '-'],
  [DIFF_INSERT]: ['green', '+'],
} as const;

function printDiff({ 0: op, 1: text }: Diff, lineNo: number): string {
  const [method, indicator] = DIFF_MAP[op];
  return `${chalk.dim(lineNo.toString().padStart(8))} | ${chalk[method](`${indicator}  ${text}`)}`;
}
