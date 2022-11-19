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
export declare function range(start: number): Iterable<number>;
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
export declare function range(start: number, count: number): Iterable<number>;
export interface GenerateBaseOptions<A> {
    initialState: A;
    iterate: (value: A, index: number) => A;
    condition?: (value: A, index: number) => boolean;
}
export interface GenerateOptions<A, T> extends GenerateBaseOptions<A> {
    resultSelector: (value: A, index: number) => T;
}
export declare function generate<A>(options: GenerateBaseOptions<A>): Iterable<A>;
export declare function generate<A, T>(options: GenerateOptions<A, T>): Iterable<T>;
export declare function just<A>(value: A): Iterable<A>;
