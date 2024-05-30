/**
 * 読み込んだ設定値にデフォルト値を適用します。
 * @param loaded 読み込んだ設定値
 * @param defaults デフォルト値
 * @returns  読み込んだ設定値にデフォルト値を適用した値
 */
export function ensureConfig(loaded, defaults) {
    if (typeof defaults === 'function' ||
        defaults === null ||
        defaults === undefined) {
        throw new Error('No functions or nullish values can be specified for `defaults`.');
    }
    if (typeof loaded === 'function') {
        throw new Error('No functions can be specified for `loaded`.');
    }
    if (loaded == null) {
        // loadedがnullishならdefaultsを返す
        return defaults;
    }
    if (typeof defaults !== 'object' ||
        Array.isArray(defaults) ||
        typeof loaded !== 'object' ||
        Array.isArray(loaded)) {
        // defaultsもloadedもobject(arrayは除外)でなければloadedを返す
        return loaded;
    }
    // defaultsもloadedもobjectなら各プロパティを確認
    const result = loaded;
    for (const [key, value] of Object.entries(defaults)) {
        result[key] = ensureConfig(result[key], value);
    }
    return result;
}
//# sourceMappingURL=ensureConfig.js.map