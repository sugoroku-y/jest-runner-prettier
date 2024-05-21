/** @type {import('jest').Config} */
const config = {
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
            tsconfig: `<rootDir>/tests/tsconfig.json`,
          },
        ],
      },
      transformIgnorePatterns: ['/node_modules/(?!p-limit/)'],
      coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    },
    ...(['true', 'eslint'].includes(process.env.npm_config_lint)
      ? // npm test --lintで実行すると以下も追加でテストする
        [
          // eslintでのチェック
          {
            displayName: 'eslint',
            runner: 'eslint',
            testMatch: [
              '<rootDir>/src/**/*.ts',
              '<rootDir>/tests/**/*.ts',
              '<rootDir>/tests/**/*.ts',
              '<rootDir>/*.js',
              '<rootDir>/*.mjs',
              '<rootDir>/*.cjs',
            ],
          },
        ]
      : []),
    ...(['true', 'prettier'].includes(process.env.npm_config_lint)
      ? [
          // prettierで整形して差異がないかチェック
          { preset: './jest-preset.js', runner: './dist/index.js' },
        ]
      : []),
  ],
  collectCoverage: !!process.env.npm_config_coverage,
};

export default config;
