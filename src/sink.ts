import { buffer, reduce, ReduceFn } from './transform';

/**
 * Consumes an iterator calling a side-effect function on each emitted value.
 *
 * @example
 * ```
 * pipe([1, 2, 3], map(x => x * 2), forEach(console.log))
 * ```
 * @param effect - The function call on each upstream value.
 * @returns Nothing, consumes the upstream iterator.
 */
export const forEach = <A>(effect: (input: A, index: number) => void) =>
  function (it: Iterable<A>) {
    let i = 0;
    for (const el of it) {
      effect(el, i);
      i += 1;
    }
  };

/**
 * Takes an iterator and returns all elements as an array.
 *
 * @example
 * ```
 * pipe([1, 2, 3], map(v => v * 2), unwrap());
 * // returns [2, 4, 6]
 * ```
 * @returns An array of all elements in the iterator.
 */
export const unwrap = () =>
  function <A>(it: Iterable<A>) {
    const result = [...buffer()(it)];
    if (result.length === 0) {
      throw new TypeError('No values to unwrap.');
    }
    return result[0];
  };

/**
 * Takes an iterator and returns the first element.
 *
 * @example
 * ```typescript
 * pipe([1, 2, 3], map(v => v * 2), unwrapFirst());
 * // returns "2"
 * ```
 * @throws {@link TypeError}. In case the upstream was empty.
 * @returns The first element returned by the iterator.
 */
export const unwrapFirst = () =>
  function <A>(it: Iterable<A>) {
    const next = it[Symbol.iterator]().next();
    if (next.done) {
      throw new TypeError('Tried to unwrap first element from empty iterator.');
    }
    return next.value;
  };

/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and returns a single value.
 *
 * @throws {@link TypeError}. In case the upstream was empty.
 * @param fn - Standard array.reduce reducer.
 * @returns Single reduced value.
 */
export function unwrapReduce<A>(fn: ReduceFn<A, A>): (_: Iterable<A>) => A;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and returns a single value.
 *
 * @throws {@link TypeError}. In case the upstream was empty.
 * @param fn - Standard array.reduce reducer.
 * @param initial - Initial value passed down to `fn` as accumulator.
 * @returns A single reduced value.
 */
export function unwrapReduce<A, U>(
  fn: ReduceFn<A, U>,
  initial: U,
): (_: Iterable<A>) => U;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and returns a single value.
 *
 * @throws {@link TypeError}. In case the upstream was empty.
 * @param args - Standard array.reduce arguments.
 * @returns A single reduced value.
 */
export function unwrapReduce<A, U>(
  ...args: [ReduceFn<A, A>] | [ReduceFn<A, U>, U]
) {
  return function (it: Iterable<A>) {
    let reduced;
    // reduce can pass `undefined` as initial value.
    // It uses number of arguments to discern whether undefined was passed or not.
    switch (args.length) {
      case 1:
        reduced = unwrap()(reduce(args[0])(it));
        break;
      case 2:
        reduced = unwrap()(reduce(args[0], args[1])(it));
        break;
      /* c8 ignore start */
      default:
        ((_: never) => {
          throw new Error('Unreachable');
        })(args);
      /* c8 ignore end */
    }

    if (reduced === undefined || reduced.length !== 1) {
      throw new Error('Internal Error: unwrapReduce assumptions wrong.');
    }

    return reduced[0];
  };
}
