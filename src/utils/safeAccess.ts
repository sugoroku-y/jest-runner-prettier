/**
 * oがkで指定されたプロパティに安全にアクセスするための関数です。
 * @param o 対象の値
 * @param k アクセスするプロパティのキー
 * @returns oがkで指定されたプロパティを持っていればその値を返します。
 *
 * oがNullishだったり、プロパティを持っていなかったらundefinedを返します。
 */
export function safeAccess<
    T extends object,
    K extends T extends T ? keyof T : never,
>(
    o: T | undefined,
    k: K,
): (T extends Record<K, unknown> ? T[K] : never) | undefined {
    return o && k in o
        ? (o as Record<K, T extends Record<K, unknown> ? T[K] : never>)[k]
        : undefined;
}
