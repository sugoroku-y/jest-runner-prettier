import type { Config } from 'jest';

export default {
    projects: [
        // prettierで整形して差異がないかチェック
        { preset: './jest-preset.js', runner: './dist/index.js' },
    ],
} satisfies Config;
