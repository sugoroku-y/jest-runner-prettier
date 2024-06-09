import { CallbackTestRunner } from 'jest-runner';
import { getFileInfo } from 'prettier';
import pLimit from '@sugoroku-y/p-limit';
import { loadRunnerConfig } from './loadRunnerConfig.js';
import { runPrettierTest } from './runPrettierTest.js';
export class JestRunnerPrettier extends CallbackTestRunner {
    async runTests(...[tests, , onStart, onResult, onFailure]) {
        const { rootDir, maxWorkers } = this._globalConfig;
        const runnerConfig = await loadRunnerConfig(rootDir);
        const { ignorePath, withNodeModules, plugins } = runnerConfig;
        const limit = pLimit(maxWorkers);
        await Promise.all(tests.map((test) => limit(async () => {
            const info = await getFileInfo(test.path, {
                ignorePath,
                withNodeModules,
                plugins,
                // https://prettier.io/docs/en/api.html#prettiergetfileinfofileurlorpath--options には
                // When setting options.resolveConfig (boolean, default true) to false, Prettier will not search for
                // configuration file.This can be useful if this function is only used to check if file is ignored.
                // > options.resolveConfig (boolean, default true) を false に設定すると、Prettier は設定ファイルを検索しません。
                // > これは、この関数がファイルが無視されているかどうかをチェックするためだけに使われる場合に便利です。
                // とあるが、設定ファイルのparserプロパティの指定により対象となることがあるのでfalseにはしない。
                // resolveConfig: false,
            });
            if (info.inferredParser) {
                await onStart(test);
                await runPrettierTest(test.path, rootDir, runnerConfig).then(onResult.bind(null, test), onFailure.bind(null, test));
            }
        })));
    }
}
//# sourceMappingURL=JestRunnerPrettier.js.map