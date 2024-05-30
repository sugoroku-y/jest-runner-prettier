import { getSupportInfo } from 'prettier';

/** @type {string[]} */
const moduleFileExtensions = ['']; // 拡張子なしも追加

(async () => {
    // Prettierがサポートする拡張子をすべてmoduleFileExtensionsとして返す
    const { languages } = await getSupportInfo();
    const extensions = languages.flatMap(({ extensions }) => extensions ?? []);
    moduleFileExtensions.push(...extensions.map((s) => s.slice(1)));
})();

export default {
    // Jest実行時に表示される名前
    displayName: 'prettier',
    // このモジュールを指定する
    runner: '@sugoroku-y/jest-runner-prettier',
    // 取得したPrettierがサポートする拡張子を返す。
    get moduleFileExtensions() {
        return moduleFileExtensions;
    },
    // まず全てのファイルを対象としておいてrunTests内で絞り込む
    testMatch: ['<rootDir>/**'],
};
