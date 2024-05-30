/**
 * Jest実行時にモジュールの場所を解決します。
 * @param {string} path 元のパス
 * @param {import('jest-resolve').ResolverOptions} options モジュール解決のためのオプション
 * @returns 解決結果
 */
function resolver(path, options) {
    const { defaultResolver } = options;
    const replaced = path.replace(/\.js$/i, '.ts');
    if (replaced !== path) {
        try {
            // 変換したpathでまず試す
            return defaultResolver(replaced, options);
        } catch {
            // 変換したpathでエラーが発生したら元のpathでも試す
        }
    }
    return defaultResolver(path, options);
}

module.exports = resolver;
