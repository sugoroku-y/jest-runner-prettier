import { cosmiconfig } from 'cosmiconfig';
import { ensureConfig } from '../utils/ensureConfig.js';

export interface RunnerConfig {
  config?: string;
  ignorePath: string[] | string;
  diff: {
    expand: boolean;
    contextLines: number;
  };
}

const DEFAULT_CONFIG: RunnerConfig = {
  ignorePath: ['.gitignore', '.prettierignore'],
  diff: {
    expand: false,
    contextLines: 2,
  },
};

export async function loadRunnerConfig(rootDir: string): Promise<RunnerConfig> {
  const cc = cosmiconfig('jest-runner-prettier');
  const result = await cc.search(rootDir);
  return ensureConfig(result?.config, DEFAULT_CONFIG);
}
