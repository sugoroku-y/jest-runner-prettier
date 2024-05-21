import { resolve } from 'path';

export const DEFAULT_CONFIG = {
  ignorePath: ['.gitignore', '.prettierignore'],
  diff: { expand: false, contextLines: 2 },
};
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ここではNullishにならない
const SCRIPT_PATH = expect.getState().testPath!;
const DATA_DIR = resolve(SCRIPT_PATH, '..', 'data');
export const PROJECT_DIR = resolve(DATA_DIR, 'project');
export const SUCCESS_JSON = resolve(PROJECT_DIR, 'success.json');
export const FAILURE_DIR = resolve(DATA_DIR, 'failure');
export const FAILURE_JSON = resolve(FAILURE_DIR, 'failure.json');
export const SAMPLE_TS = resolve(PROJECT_DIR, 'sample.ts');
export const CONFIG_JS = resolve(DATA_DIR, 'config.js');
export const DOT_RC_JSON = resolve(DATA_DIR, '.rc.json');
export const CONFIG_NOT_EXIST = resolve(DATA_DIR, 'config.not-exist');
export const PACKAGE_JSON = resolve(DATA_DIR, 'package.json');
