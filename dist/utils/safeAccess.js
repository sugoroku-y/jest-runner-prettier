export function safeAccess(o, k) {
    return o && k in o
        ? o[k]
        : undefined;
}
//# sourceMappingURL=safeAccess.js.map