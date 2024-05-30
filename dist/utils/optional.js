/**
 * 指定の値がNullishでなかったときに関数を実行します。
 * @param o 検査対象の値
 * @returns oがNullishでなかった場合、指定された関数を実行するための関数を返します。
 *
 * oがNullishだった場合はundefinedを返します。
 */
export function optional(o) {
    return o != null ? (f) => f(o) : undefined;
}
//# sourceMappingURL=optional.js.map