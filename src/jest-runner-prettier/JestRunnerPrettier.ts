import { CallbackTestRunner } from 'jest-runner';
import { getFileInfo } from 'prettier';
import { pLimit } from '../utils/p-limit.js';
import { loadRunnerConfig } from './loadRunnerConfig.js';
import { runPrettierTest } from './runPrettierTest.js';

export class JestRunnerPrettier extends CallbackTestRunner {
  override async runTests(
    ...[tests, , onStart, onResult, onFailure]: Parameters<
      CallbackTestRunner['runTests']
    >
  ): Promise<void> {
    const { rootDir, maxWorkers } = this._globalConfig;
    const runnerConfig = await loadRunnerConfig(rootDir);
    const { ignorePath, withNodeModules, plugins } = runnerConfig;
    const limit = pLimit(maxWorkers);
    await Promise.all(
      tests.map((test) =>
        limit(async () => {
          const info = await getFileInfo(test.path, {
            ignorePath,
            withNodeModules,
            plugins,
            resolveConfig: false,
          });
          if (info.inferredParser) {
            await onStart(test);
            await runPrettierTest(test.path, rootDir, runnerConfig).then(
              onResult.bind(null, test),
              onFailure.bind(null, test),
            );
          }
        }),
      ),
    );
  }
}
