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
