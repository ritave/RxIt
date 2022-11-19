// TypeScript language server doesn't like more complicate solutions.
// It just bails out and errors out. So we use a very simple typing
type Op<P, R> = (input: P) => R;

/* eslint-disable jsdoc/require-param */
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A>(a: A): A;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B>(a: A, b: Op<A, B>): B;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C>(a: A, b: Op<A, B>, c: Op<B, C>): C;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C, D>(
  a: A,
  b: Op<A, B>,
  c: Op<B, C>,
  d: Op<C, D>,
): D;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C, D, E>(
  a: A,
  b: Op<A, B>,
  c: Op<B, C>,
  d: Op<C, D>,
  e: Op<D, E>,
): E;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C, D, E, F>(
  a: A,
  b: Op<A, B>,
  c: Op<B, C>,
  d: Op<C, D>,
  e: Op<D, E>,
  f: Op<E, F>,
): F;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  b: Op<A, B>,
  c: Op<B, C>,
  d: Op<C, D>,
  e: Op<D, E>,
  f: Op<E, F>,
  g: Op<F, G>,
): G;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  b: Op<A, B>,
  c: Op<B, C>,
  d: Op<C, D>,
  e: Op<D, E>,
  f: Op<E, F>,
  g: Op<F, G>,
  h: Op<G, H>,
): H;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  b: Op<A, B>,
  c: Op<B, C>,
  d: Op<C, D>,
  e: Op<D, E>,
  f: Op<E, F>,
  g: Op<F, G>,
  h: Op<G, H>,
  i: Op<H, I>,
): I;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  a: A,
  b: Op<A, B>,
  c: Op<B, C>,
  d: Op<C, D>,
  e: Op<D, E>,
  f: Op<E, F>,
  g: Op<F, G>,
  h: Op<G, H>,
  i: Op<H, I>,
  j: Op<I, J>,
): J;
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @returns The result of the last function call.
 */
export function pipe(a: any, ...fns: Op<any, any>[]): any;
/* eslint-enable jsdoc/require-param */
/**
 * Takes the first element and passes if through a list of operator functions.
 *
 * ```
 * pipe(a, fn_1, fn_2, fn_3) === fn_3(fn_2(fn_1(a)))
 * ```
 *
 * @param a - The argument to pass down.
 * @param fns - The list of functions.
 * @returns The result of the last function call.
 */
export function pipe(a: any, ...fns: Op<any, any>[]): any {
  return fns.reduce((prev, func) => func(prev), a);
}
