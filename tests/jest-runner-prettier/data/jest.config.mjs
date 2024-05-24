/** @type {import('jest').Config} */
const config = {
    projects: [
        // prettierで整形して差異がないかチェック
        { preset: '../../../jest-preset.js', runner: '../../../dist/index.js' },
    ],
};
export default config;
