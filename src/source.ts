/**
 * Creates an iterator that emits values from `start` indefinitely.
 *
 * ```text
 * range(3)
 * -3--4--5--6--...
 * ```
 *
 * @param start - Initial value.
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
 */
export function range(start: number, count: number): Iterable<number>;
export function* range(start: number, count?: number) {
  let at = start;
  let i = 0;
  while (count === undefined || i < count) {
    yield at;
    at += 1;
    i += 1;
  }
}

export interface GenerateBaseOptions<A> {
  initialState: A;
  iterate: (value: A, index: number) => A;
  condition?: (value: A, index: number) => boolean;
}
export interface GenerateOptions<A, T> extends GenerateBaseOptions<A> {
  resultSelector: (value: A, index: number) => T;
}

export function generate<A>(options: GenerateBaseOptions<A>): Iterable<A>;
export function generate<A, T>(options: GenerateOptions<A, T>): Iterable<T>;
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

export function* just<A>(value: A): Iterable<A> {
  yield value;
}
