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
export const sort = <V>(cmp?: (a: V, b: V) => number) =>
  function* (it: Iterable<V>) {
    const acc = [...it];
    yield* acc.sort(cmp);
  };

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
export const map = <V, R>(fn: (input: V, index: number) => R) =>
  function* (it: Iterable<V>) {
    let i = 0;
    for (const el of it) {
      yield fn(el, i);
      i += 1;
    }
  };

export const flatMap = <A, T>(map: (value: A, index: number) => Iterable<T>) =>
  function* (it: Iterable<A>) {
    let i = 0;
    for (const el of it) {
      const subIt = map(el, i);
      yield* subIt;
      i += 1;
    }
  };

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
export const tap = <A>(effect: (input: A, index: number) => void) =>
  function* (it: Iterable<A>) {
    let i = 0;
    for (const el of it) {
      effect(el, i);
      yield el;
      i += 1;
    }
  };

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
export const filter = <A>(predicate: (el: A, index: number) => boolean) =>
  function* (it: Iterable<A>) {
    let i = 0;
    for (const el of it) {
      if (predicate(el, i)) {
        yield el;
      }
      i += 1;
    }
  };

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
export const take =
  (count = 1) =>
  <A>(it: Iterable<A>) =>
    takeWhile<A>((_, index) => index < count)(it);

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
export const takeWhile = <A>(
  predicate: (element: A, index: number) => boolean,
) =>
  function* (it: Iterable<A>) {
    let i = 0;
    for (const el of it) {
      if (!predicate(el, i)) {
        return;
      }
      yield el;
      i += 1;
    }
  };

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
export const skip =
  (count = 1) =>
  <A>(it: Iterable<A>) =>
    skipWhile<A>((_, index) => index < count)(it);

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
export const skipWhile = <A>(
  predicate: (element: A, index: number) => boolean,
) =>
  function* (it: Iterable<A>) {
    let i = 0;
    let shouldYield = false;
    for (const el of it) {
      if (shouldYield) {
        yield el;
      } else {
        shouldYield = !predicate(el, i);
        if (shouldYield) {
          yield el;
        }
      }
      i += 1;
    }
  };

export type ReduceFn<A, U> = (acc: U, curr: A) => U;
const unused = Symbol('No value was set');
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
export function reduce<A, U>(
  fn: ReduceFn<A, U>,
): (it: Iterable<A>) => Iterable<U>;
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
export function reduce<A, U>(
  fn: ReduceFn<A, U>,
  // Different documentation, and undefined can be passed as a second argument
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  initial: U,
): (it: Iterable<A>) => Iterable<U>;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and emits a single value.
 *
 * @param args - Standard array.reduce arguments.
 * @returns An iterator with single reduced value.
 */
export function reduce<A, U>(...args: [ReduceFn<A, U>] | [ReduceFn<A, A>, A]) {
  const fn: (acc: any, curr: any) => any = args[0];
  let acc: typeof unused | A | U = args.length === 2 ? args[1] : unused;

  return function* (it: Iterable<A>) {
    for (const el of it) {
      if (acc === unused) {
        acc = el;
      } else {
        acc = fn(acc, el);
      }
    }

    if (acc !== unused) {
      yield acc;
    }
  };
}

export type BufferClose<A> = (value: A, index: number, buffer: A[]) => boolean;
/**
 * Takes an iterator, gathers all elements into an array and emits that array.
 *
 * ```text
 * -2----3--4------5--|>
 * buffer(x => x % 2 == 0)
 * -[2]-----[3, 4]----[5]-|>
 * ```
 *
 * @returns An iterator with single element array with all upstream values.
 */
export function buffer<A>(
  close: BufferClose<A>,
): (it: Iterable<A>) => Iterable<A[]>;
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
export function buffer(): <A>(it: Iterable<A>) => Iterable<A[]>;
export function buffer<A>(close: BufferClose<A> = () => false) {
  return function* (it: Iterable<A>) {
    let state: A[] = [];
    let i = 0;

    for (const el of it) {
      state = state.concat([el]);
      if (close(el, i, state)) {
        yield state;
        state = [];
      }
      i += 1;
    }

    if (state.length) {
      yield state;
    }
  };
}

export type BufferOpen<A> = (
  value: A,
  index: number,
) => boolean | BufferClose<A>;
export const bufferToggle = <A>(open: BufferOpen<A>) =>
  function* (it: Iterable<A>) {
    type Buffer = { state: A[]; close: BufferClose<A> };
    let buffers: (Buffer | null)[] = [];
    let i = 0;

    for (const el of it) {
      const shouldOpen = open(el, i);

      if (shouldOpen !== false) {
        let close: BufferClose<A>;
        if (shouldOpen === true) {
          close = () => false;
        } else {
          close = shouldOpen;
        }
        buffers.push({ state: [], close });
      }
      for (let j = 0; j < buffers.length; j++) {
        const buffer = buffers[j] as Buffer | null;

        if (buffer !== null) {
          buffer.state = buffer.state.concat([el]);

          if (buffer.close(el, i, buffer.state)) {
            buffers[j] = null;
            yield buffer.state;
          }
        }
      }

      i += 1;
      while (buffers[0] === null) {
        buffers.shift();
      }
    }

    if (buffers.length) {
      for (const buffer of buffers) {
        if (buffer !== null) {
          yield buffer.state;
        }
      }
    }
  };
