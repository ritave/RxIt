/**
 * Counts the number of elements in the upstream iterator.
 *
 * ```text
 * --1--1--1--2--3--4-|>
 * count()
 * -------------------6-|>
 * ```
 *
 * @returns The number of elements in the upstream iterator.
 */
export function count() {
  return function* (it: Iterable<unknown>) {
    let noElements = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of it) {
      noElements += 1;
    }
    yield noElements;
  };
}

/**
 * Emits a default value if the upstream iterator is empty
 *
 * ```text
 * ----|>
 * defaultIfEmpty(42)
 * ----42-|>
 * ```
 *
 * @param defaultValue - The value to emit.
 * @returns An iterator that emits upstream or default value if upstream is emtpy.
 */
export function defaultIfEmpty<V, R>(defaultValue: R) {
  return function* (it: Iterable<V>): Iterable<V | R> {
    let hasEmitted = false;
    for (const el of it) {
      yield el;
      hasEmitted = true;
    }

    if (!hasEmitted) {
      yield defaultValue;
    }
  };
}

/**
 * Takes an iterator, emits only values that are distinct from all other previous values
 *
 * ```text
 * -1--1--2--1--2--3--2--1--4--3--2-|>
 * distinct()
 * -1-----2--------3--------4-------|>
 * ```
 *
 * @param keySelector - An optional function that chooses a key to compare distinctness of elements with. Defaults to identity.
 * @returns An iterator that emits only distinct values.
 */
export const distinct = <V>(keySelector: (val: V) => any = (val) => val) =>
  function* (it: Iterable<V>) {
    const hasSeen = new Set();
    for (const el of it) {
      const key = keySelector(el);
      if (!hasSeen.has(key)) {
        hasSeen.add(key);
        yield el;
      }
    }
  };

const noValue = Symbol('No value');
/**
 * Takes an iterator, emits only values that are distinct from the last previous value.
 *
 * ```text
 * -1--1--2--1--2--3--3--1--4--4--4-|>
 * distinctUntilChanged()
 * -1-----2--1--2--3-----1--4-------|>
 * ```
 *
 * @param comparator - An optional function to compare current and previous values. Defaults to ===.
 * @param keySelector - An optional function that chooses a key to compare distinctness of elements with. Defaults to identity.
 * @returns An iterator that emits only distinct values.
 */
export const distinctUntilChanged = <V, K = V>(
  comparator: (a: K, b: K) => boolean = (a, b) => a === b,
  keySelector: (val: V) => K = (val) => val as any,
) =>
  function* (it: Iterable<V>) {
    let last: K | typeof noValue = noValue;
    for (const el of it) {
      const key = keySelector(el);
      if (last === noValue || !comparator(last, key)) {
        last = key;
        yield el;
      }
    }
  };

/**
 * Emits a value from upstream iterator at a given index
 *
 * ```text
 * --2--3--4--5->
 * elementAt(1)
 * -----3-|>
 * ```
 *
 * @param index - The index on to emit.
 * @throws {@link RangeError} If the upstream iterator finished before the requested index.
 * @returns An iterator that emits only one value on given index.
 */
export function elementAt<V>(index: number) {
  return function* (it: Iterable<V>) {
    let currentIndex = 0;
    for (const el of it) {
      if (currentIndex === index) {
        yield el;
        return;
      }
      currentIndex += 1;
    }
    throw new RangeError('Iterator finished before expected index.');
  };
}

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
 * @param mapping - Mapping function.
 * @returns An iterator with each value mapped using `fn`.
 */
export const map = <V, R>(mapping: (input: V, index: number) => R) =>
  function* (it: Iterable<V>) {
    let i = 0;
    for (const el of it) {
      yield mapping(el, i);
      i += 1;
    }
  };

/**
 * Takes an iterator, emits values from iterators returned from `mapping` function.
 *
 * ```text
 * -1--2----3------4-|>
 * flatMap(x => range(1, x))
 * -1--1-2--1-2-3--1-2-3-4-|>
 * ```
 *
 * @param mapping - A function that maps an original value to a new iterator.
 * @returns An iterator that yields values from all `mapping` calls.
 */
export const flatMap = <A, T>(
  mapping: (value: A, index: number) => Iterable<T>,
) =>
  function* (it: Iterable<A>) {
    let i = 0;
    for (const el of it) {
      const subIt = mapping(el, i);
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
 * Emits only the first value that satisfies the predicate.
 *
 * ```text
 * --1--3--6--5--9--10-|>
 * find(x => x % 5 === 0)
 * -----------5-|>
 * ```
 *
 * @param predicate - A test function called on each value.
 * @returns An iterator with a single found value.
 */
export const find = <A>(predicate: (el: A, index: number) => boolean) =>
  function* (it: Iterable<A>) {
    const i = 0;
    for (const el of it) {
      if (predicate(el, i)) {
        yield el;
        return;
      }
    }
  };

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
 * Takes up-to `count` elements from the upstream iterator and emits them.
 *
 * ```text
 * -2--3--4--5-|>
 * take(2)
 * -2--3-|>
 * ```
 *
 * @param countElements - The number of elements to take from the iterator.
 * @returns An iterator with up-to `count` elements.
 */
export const take =
  (countElements = 1) =>
  <A>(it: Iterable<A>) =>
    takeWhile<A>((_, index) => index < countElements)(it);

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

/**
 * Skips first `count` elements from the upstream iterator and emits the rest.
 *
 * ```text
 * -2--3--4--5--6-|>
 * skip(2)
 * -------4--5--6-|>
 * ```
 *
 * @param countSkipped - The number of elements to skip from the upstream.
 * @returns An iterator with first `count` elements skipped.
 */
export const skip =
  (countSkipped = 1) =>
  <A>(it: Iterable<A>) =>
    skipWhile<A>((_, index) => index < countSkipped)(it);

/**
 * Emits `values` before emitting from upstream.
 *
 * ```text
 * -1--2--3-|>
 * startWith(4, 5, 6)
 * -4--5--6--1--2--3-|>
 * ```
 *
 * @param values - Values to prepend before upstream emissions.
 * @returns An iterator with `values` prepended.
 */
export function startWith<V, K>(...values: V[]) {
  return function* (it: Iterable<K>) {
    yield* values;
    yield* it;
  };
}

/**
 * Emits `values` after emitting from upstream.
 *
 * ```text
 * -1--2--3-\>
 * endWith(4, 5, 6)
 * -1--2--3--4--5--6-|>
 * ```
 *
 * @param values - Values to append after upstream emissions.
 * @returns An iterator with `values` appended.
 */
export function endWith<V, K>(...values: V[]) {
  return function* (it: Iterable<K>) {
    yield* it;
    yield* values;
  };
}

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

/**
 * Stores and re-emits the upstream sequence of emissions `count` times.
 *
 * ```text
 * -1--2--3-|>
 * repeat(3)
 * -1--2--3--1--2--3--1--2--3-|>
 * ```
 *
 * @param countRepeats - The number of times to repeat the sequence. Infinite times if undefined.
 * @returns An iterator repeating the sequence of emissions.
 */
export function repeat(countRepeats?: number) {
  return function* <V>(iterator: Iterable<V>) {
    const values = [];
    if (countRepeats === 0) {
      return;
    }

    for (const el of iterator) {
      values.push(el);
      yield el;
    }

    // Notice that it's infinite if the number is negative
    for (
      let currentCount = countRepeats ? countRepeats - 1 : -1;
      currentCount !== 0;
      currentCount--
    ) {
      yield* values;
    }
  };
}

export type BufferClose<A> = (value: A, index: number, buffer: A[]) => boolean;
/**
 * Takes an iterator, gathers all elements into an array and emits that array.
 *
 * ```text
 * -2----3--4------5-|>
 * buffer(x => x % 2 == 0)
 * -[2]-----[3, 4]---[5]-|>
 * ```
 *
 * @param close - A predicate that closes and emits the buffer on `true`.
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
 * ------------[2,3,4,5]-|>
 * ```
 *
 * @returns An iterator with single element array with all upstream values.
 */
export function buffer(): <A>(it: Iterable<A>) => Iterable<A[]>;
// eslint-disable-next-line jsdoc/require-jsdoc
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
/**
 * Takes an iterator, opens buffers when `open` returns `true` or returns a `close` function, and emits them when `close` returns `true`.
 *
 * ```text
 * -1--2--3--4--5--6-|>
 * bufferToggle(x => x % 2 === 1)
 * ------------------[1,2,3,4,5,6][3,4,5,6][5,6]-|>
 * ```
 *
 * ```text
 * -1--2------3--4-----5-|>
 * bufferToggle(x => x % 2 === 1 ? (y => y % 2 === 0) : false)
 * ----[1,2]-----[3,4]---[5]-|>
 * ```
 *
 * @param open - A function that does nothing on `false`, opens a buffer otherwise. Closes the buffer when a function returned from `open` returns `true`.
 * @returns An iterator with values grouped into arrays by the `open` function.
 */
export const bufferToggle = <A>(open: BufferOpen<A>) =>
  function* (it: Iterable<A>) {
    type Buffer = { state: A[]; close: BufferClose<A> };
    const buffers: (Buffer | null)[] = [];
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
        const subBuffer = buffers[j] as Buffer | null;

        if (subBuffer !== null) {
          subBuffer.state = subBuffer.state.concat([el]);

          if (subBuffer.close(el, i, subBuffer.state)) {
            buffers[j] = null;
            yield subBuffer.state;
          }
        }
      }

      i += 1;
      while (buffers[0] === null) {
        buffers.shift();
      }
    }

    if (buffers.length) {
      for (const subBuffer of buffers) {
        if (subBuffer !== null) {
          yield subBuffer.state;
        }
      }
    }
  };
