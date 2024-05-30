import {
    loadRunnerConfig,
    type RunnerConfig,
} from '../../src/jest-runner-prettier/loadRunnerConfig';
import {
    CONFIG_JS,
    CONFIG_NOT_EXIST,
    DOT_RC_JSON,
    PACKAGE_JSON,
} from './constants';

describe('loadRunnerConfig', () => {
    test('config.js', async () => {
        const config = await loadRunnerConfig(CONFIG_JS);
        expect(config).toEqual({
            config: '.example',
            editorconfig: true,
            ignorePath: ['.gitignore', '.prettierignore'],
            diff: {
                expand: true,
                contextLines: 2,
                thresholdForOmitting: 20,
            },
        } satisfies RunnerConfig);
    });
    test('.rc.json', async () => {
        const config = await loadRunnerConfig(DOT_RC_JSON);
        expect(config).toEqual({
            editorconfig: true,
            ignorePath: '.prettierignore',
            diff: {
                expand: false,
                contextLines: 2,
                thresholdForOmitting: 20,
            },
        } satisfies RunnerConfig);
    });
    test('config.not-exist', async () => {
        const config = await loadRunnerConfig(CONFIG_NOT_EXIST);
        expect(config).toEqual({
            editorconfig: true,
            ignorePath: ['.gitignore', '.prettierignore'],
            diff: {
                expand: false,
                contextLines: 2,
                thresholdForOmitting: 20,
            },
        } satisfies RunnerConfig);
    });
    test('package.json', async () => {
        const config = await loadRunnerConfig(PACKAGE_JSON);
        expect(config).toEqual({
            config: '.example',
            editorconfig: true,
            ignorePath: ['.gitignore'],
            diff: {
                expand: false,
                contextLines: 2,
                thresholdForOmitting: 20,
            },
        } satisfies RunnerConfig);
    });
});
