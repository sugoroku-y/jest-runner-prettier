import { loadRunnerConfig } from '../../src/jest-runner-prettier/loadRunnerConfig';
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
      ignorePath: ['.gitignore', '.prettierignore'],
      diff: {
        expand: true,
        contextLines: 2,
      },
    });
  });
  test('.rc.json', async () => {
    const config = await loadRunnerConfig(DOT_RC_JSON);
    expect(config).toEqual({
      ignorePath: '.prettierignore',
      diff: {
        expand: false,
        contextLines: 2,
      },
    });
  });
  test('config.not-exist', async () => {
    const config = await loadRunnerConfig(CONFIG_NOT_EXIST);
    expect(config).toEqual({
      ignorePath: ['.gitignore', '.prettierignore'],
      diff: {
        expand: false,
        contextLines: 2,
      },
    });
  });
  test('package.json', async () => {
    const config = await loadRunnerConfig(PACKAGE_JSON);
    expect(config).toEqual({
      config: '.example',
      ignorePath: ['.gitignore'],
      diff: {
        expand: false,
        contextLines: 2,
      },
    });
  });
});
