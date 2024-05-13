/**
 * Create an iterator with no values that completes immediately.
 *
 * @returns An empty iterator.
 */
export function* empty() {
  /* empty */
}

/**
 * Creates an iterator that emits values from `start` indefinitely.
 *
 * ```text
 * range(3)
 * -3--4--5--6--...
 * ```
 *
 * @param start - Initial value.
 * @returns An iterator indefinitely emitting values from `start`.
 */
export function range(start: number): Iterable<number>;
/**
 * Creates an iterator that emits `count` values, starting from `start`.
 *
 * ```text
 * range(1, 5)
 * -1--2--3--4--5-|>
 * ```
 *
 * @param start - Initial value.
 * @param count - How many values to emit.
 * @returns An iterator emitting `count` values starting from `start.
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures
export function range(start: number, count: number): Iterable<number>;
// eslint-disable-next-line jsdoc/require-jsdoc
export function* range(start: number, count?: number) {
  let at = start;
  let i = 0;
  // eslint-disable-next-line no-unmodified-loop-condition
  while (count === undefined || i < count) {
    yield at;
    at += 1;
    i += 1;
  }
}

export type GenerateBaseOptions<A> = {
  initialState: A;
  iterate: (value: A, index: number) => A;
  condition?: (value: A, index: number) => boolean;
};
export type GenerateOptions<A, T> = {
  resultSelector: (value: A, index: number) => T;
} & GenerateBaseOptions<A>;

/**
 * Generates values.
 *
 * @param options - Options taking initialState, iterate and optionally a condition.
 * @returns An iterable generating functions based on options.
 * @see {@link GenerateBaseOptions}
 */
export function generate<A>(options: GenerateBaseOptions<A>): Iterable<A>;
/**
 * Generates values.
 *
 * @param options - Options taking initialState, iterate, resultSelector and optionally a condition.
 * @returns An iterable generating functions based on options.
 * @see {@link GenerateOptions}
 */
export function generate<A, T>(options: GenerateOptions<A, T>): Iterable<T>;
// eslint-disable-next-line jsdoc/require-jsdoc
export function* generate<A, T>(
  options: GenerateBaseOptions<A> | GenerateOptions<A, T>,
): Iterable<A | T> {
  let i = 0;
  let state = options.initialState;
  while (options.condition?.(state, i) ?? true) {
    if ('resultSelector' in options) {
      yield options.resultSelector(state, i);
    } else {
      yield state;
    }
    state = options.iterate(state, i);
    i += 1;
  }
}

/**
 * Emits a single value.
 *
 * @param value - Value to emit.
 * @returns An iterator with a single `value` value.
 * @yields `value`.
 */
export function* just<A>(value: A): Iterable<A> {
  yield value;
}
