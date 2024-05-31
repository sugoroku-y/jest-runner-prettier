import type { Config } from 'jest';

export default {
    projects: [
        // 通常のjestでのテスト
        {
            preset: 'ts-jest/presets/default-esm',
            resolver: '<rootDir>/resolver.cjs',
            displayName: 'test',
            transform: {
                '\\.ts$': [
                    'ts-jest',
                    {
                        useESM: true,
                        tsconfig: 'tests/tsconfig.json',
                    },
                ],
            },
            transformIgnorePatterns: ['/node_modules/(?!p-limit/)'],
            coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
        },
        ...(process.env['npm_config_lint'] === 'true' ||
        process.env['npm_config_lint'] === 'eslint'
            ? // npm test --lint もしくは npm test --lint=eslintで実行すると以下も追加でテストする
              [
                  // eslintでのチェック
                  {
                      displayName: 'eslint',
                      runner: 'eslint',
                      testMatch: ['**/*.ts', '**/*.js', '**/*.mjs', '**/*.cjs'],
                  },
              ]
            : []),
        ...(process.env['npm_config_lint'] === 'true' ||
        process.env['npm_config_lint'] === 'prettier'
            ? // npm test --lint もしくは npm test --lint=prettierで実行すると以下も追加でテストする
              [
                  // prettierで整形して差異がないかチェック
                  { preset: './jest-preset.js', runner: './dist/index.js' },
              ]
            : []),
    ],
    collectCoverage: !!process.env['npm_config_coverage'],
} satisfies Config;
