import { cosmiconfig } from 'cosmiconfig';
import { ensureConfig } from '../utils/ensureConfig.js';
const DEFAULT_CONFIG = {
    ignorePath: ['.gitignore', '.prettierignore'],
    editorconfig: true,
    diff: {
        expand: false,
        contextLines: 2,
        thresholdForOmitting: 20,
    },
};
/**
 * Prettier実行時のカスタマイズ項目を読み込みます。
 * @param rootDir プロジェクトのルート
 * @returns カスタマイズ項目
 */
export async function loadRunnerConfig(rootDir) {
    const cc = cosmiconfig('jest-runner-prettier');
    const result = await cc.search(rootDir);
    return ensureConfig(result?.config, DEFAULT_CONFIG);
}
//# sourceMappingURL=loadRunnerConfig.js.map