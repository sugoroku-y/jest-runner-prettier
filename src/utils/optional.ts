type Converter<T> = <R>(f: (o: T) => R) => R;

export function optional<T>(o: T | null | undefined): Converter<T> | undefined {
  return o != null ? (f) => f(o) : undefined;
}
