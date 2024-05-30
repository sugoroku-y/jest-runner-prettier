type Converter<T> = <R>(f: (o: T) => R) => R;

/**
 * 指定の値がNullishでなかったときに関数を実行します。
 * @param o 検査対象の値
 * @returns oがNullishでなかった場合、指定された関数を実行するための関数を返します。
 *
 * oがNullishだった場合はundefinedを返します。
 */
export function optional<T>(o: T | null | undefined): Converter<T> | undefined {
    return o != null ? (f) => f(o) : undefined;
}
