/**
 * oがkで指定されたプロパティに安全にアクセスするための関数です。
 * @param o 対象の値
 * @param k アクセスするプロパティのキー
 * @returns oがkで指定されたプロパティを持っていればその値を返します。
 *
 * oがNullishだったり、プロパティを持っていなかったらundefinedを返します。
 */
export function safeAccess(o, k) {
    return o && k in o
        ? o[k]
        : undefined;
}
//# sourceMappingURL=safeAccess.js.map