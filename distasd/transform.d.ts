/**
 * Takes an iterator, gathers all upstream values, sorts them and emits them in sorted order.
 *
 * ```text
 * -5--4--7--2-|>
 * sort()
 * ------------2--4--5--7-|>
 * ```
 *
 * @param cmp - Standard array.sort compare function.
 * @returns An iterator with upstream values in sorted order.
 */
export declare const sort: <V>(cmp?: ((a: V, b: V) => number) | undefined) => (it: Iterable<V>) => Generator<V, void, undefined>;
/**
 * Takes an iterator, emits each value mapped using `fn`.
 *
 * ```text
 * -2--3--4-|>
 * map(x => x * 2)
 * -4--6--8-|>
 * ```
 *
 * @param fn - Mapping function.
 * @returns An iterator with each value mapped using `fn`.
 */
export declare const map: <V, R>(fn: (input: V) => R) => (it: Iterable<V>) => Generator<R, void, unknown>;
/**
 * Takes an iterator and calls a side-effect function on each emitted value.
 *
 * ```text
 * -2--3--4-|>
 * tap(console.log)
 * -2--3--4-|>
 * ```
 *
 * @param effect - Function to call on each emitted value.
 * @returns The same values as the original iterator.
 */
export declare const tap: <A>(effect: (input: A, index: number) => void) => (it: Iterable<A>) => Generator<A, void, unknown>;
/**
 * Filters out values from upstream and emits only values for which `predicate` holds
 *
 * ```text
 * -2--3--4--5--6-|>
 * filter(x => x % 2 == 0)
 * -2-----4-----6-|>
 * ```
 *
 * @param predicate - The function to filter out emitted values.
 * @returns An iterator returning filtered out values from upstream.
 */
export declare const filter: <A>(predicate: (el: A, index: number) => boolean) => (it: Iterable<A>) => Generator<A, void, unknown>;
/**
 * Takes up-to `count` elements from the upstream iterator and emits them.
 *
 * ```text
 * -2--3--4--5-|>
 * take(2)
 * -2--3-|>
 * ```
 *
 * @param count - The number of elements to take from the iterator.
 * @returns An iterator with up-to `count` elements.
 */
export declare const take: (count?: number) => <A>(it: Iterable<A>) => Generator<A, void, unknown>;
/**
 * Takes values from upstream as long as `predicate` holds. After it stops taking, finished immediately.
 *
 * ```text
 * -2--3--4--5-|>
 * takeWhile(x => x < 5)
 * -2--3--4--|>
 * ```
 *
 * @param predicate - A function that should return whether the iterator should still be emiting upstream values.
 * @returns An iterator that emits values as long as `predicate` holds.
 */
export declare const takeWhile: <A>(predicate: (element: A, index: number) => boolean) => (it: Iterable<A>) => Generator<A, void, unknown>;
/**
 * Skips first `count` elements from the upstream iterator and emits the rest.
 *
 * ```text
 * -2--3--4--5--6-|>
 * skip(2)
 * -------4--5--6-|>
 * ```
 *
 * @param count - The number of elements to skip from the upstream.
 * @returns An iterator with first `count` elements skipped.
 */
export declare const skip: (count?: number) => <A>(it: Iterable<A>) => Generator<A, void, unknown>;
/**
 * Skips values from upstream as long as `predicate` holds. After it stops holding, returns the rest of the values.
 *
 * ```text
 * -2--3--4--5--6-|>
 * skipWhile(x => x < 5)
 * ----------5--6-|>
 * ```
 *
 * @param predicate - A function that should return whether the iterator should still be skipping values emitted upstream.
 * @returns An iterator that skips first few values from upstream and emits the rest.
 */
export declare const skipWhile: <A>(predicate: (element: A, index: number) => boolean) => (it: Iterable<A>) => Generator<A, void, unknown>;
export declare type ReduceFn<A, U> = (acc: U, curr: A) => U;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and emits a single value.
 *
 * The first accumulator value is the first element from the upstream iterator.
 *
 * ```text
 * -2--3--4-|>
 * reduce((acc, val) => acc + val);
 * ---------10-|>
 * ```
 *
 * @param fn - Standard array.reduce reducer.
 * @returns An iterator with single reduced value.
 */
export declare function reduce<A, U>(fn: ReduceFn<A, U>): (it: Iterable<A>) => Iterable<U>;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and emits a single value.
 *
 * ```text
 * -2--3--4-|>
 * reduce((acc, val) => acc + val, 7);
 * ---------17-|>
 * ```
 *
 * @param fn - Standard array.reduce reducer.
 * @param initial - Initial value passed down to `fn` as accumulator.
 * @returns An iterator with single reduced value.
 */
export declare function reduce<A, U>(fn: ReduceFn<A, U>, initial: U): (it: Iterable<A>) => Iterable<U>;
/**
 * Takes an iterator, gathers all elements into an array and emits that array.
 *
 * ```text
 * -2--3--4--5-|>
 * buffer()
 * ------------[2,3,4,5]--|>
 * ```
 *
 * @returns An iterator with single element array with all upstream values.
 */
export declare const buffer: () => <A>(it: Iterable<A>) => Generator<A[], void, unknown>;
