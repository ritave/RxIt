import { ReduceFn } from './transform';
/**
 * Consumes an iterator calling a side-effect function on each emitted value.
 *
 * @example
 * ```
 * pipe([1, 2, 3], map(x => x * 2), forEach(console.log))
 * ```
 *
 * @param effect - The function call on each upstream value.
 * @returns Nothing, consumes the upstream iterator
 */
export declare const forEach: <A>(effect: (input: A, index: number) => void) => (it: Iterable<A>) => void;
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
export declare const unwrap: () => <A>(it: Iterable<A>) => A[] | undefined;
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
export declare const unwrapFirst: () => <A>(it: Iterable<A>) => A;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and returns a single value.
 *
 * @throws {@link TypeError}. In case the upstream was empty.
 * @param fn - Standard array.reduce reducer.
 * @returns Single reduced value.
 */
export declare function unwrapReduce<A>(fn: ReduceFn<A, A>): (_: Iterable<A>) => A;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and returns a single value.
 *
 * @throws {@link TypeError}. In case the upstream was empty.
 * @param fn - Standard array.reduce reducer.
 * @param initial - Initial value passed down to `fn` as accumulator.
 * @returns A single reduced value.
 */
export declare function unwrapReduce<A, U>(fn: ReduceFn<A, U>, initial: U): (_: Iterable<A>) => U;
