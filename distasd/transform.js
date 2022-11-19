"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buffer = exports.reduce = exports.skipWhile = exports.skip = exports.takeWhile = exports.take = exports.filter = exports.tap = exports.map = exports.sort = void 0;
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
const sort = (cmp) => function* (it) {
    const acc = [...it];
    yield* acc.sort(cmp);
};
exports.sort = sort;
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
const map = (fn) => function* (it) {
    for (const el of it) {
        yield fn(el);
    }
};
exports.map = map;
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
const tap = (effect) => function* (it) {
    let i = 0;
    for (const el of it) {
        effect(el, i);
        yield el;
        i += 1;
    }
};
exports.tap = tap;
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
const filter = (predicate) => function* (it) {
    let i = 0;
    for (const el of it) {
        if (predicate(el, i)) {
            yield el;
        }
        i += 1;
    }
};
exports.filter = filter;
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
const take = (count = 1) => (it) => (0, exports.takeWhile)((_, index) => index < count)(it);
exports.take = take;
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
const takeWhile = (predicate) => function* (it) {
    let i = 0;
    for (const el of it) {
        if (!predicate(el, i)) {
            return;
        }
        yield el;
        i += 1;
    }
};
exports.takeWhile = takeWhile;
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
const skip = (count = 1) => (it) => (0, exports.skipWhile)((_, index) => index < count)(it);
exports.skip = skip;
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
const skipWhile = (predicate) => function* (it) {
    let i = 0;
    let shouldYield = false;
    for (const el of it) {
        if (shouldYield) {
            yield el;
        }
        else {
            shouldYield = !predicate(el, i);
            if (shouldYield) {
                yield el;
            }
        }
        i += 1;
    }
};
exports.skipWhile = skipWhile;
const unused = Symbol('No value was set');
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and emits a single value.
 *
 * @param args - Standard array.reduce arguments.
 * @returns An iterator with single reduced value.
 */
function reduce(...args) {
    const fn = args[0];
    let acc = args.length === 2 ? args[1] : unused;
    return function* (it) {
        for (const el of it) {
            if (acc === unused) {
                acc = el;
            }
            else {
                acc = fn(acc, el);
            }
        }
        if (acc !== unused) {
            yield acc;
        }
    };
}
exports.reduce = reduce;
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
const buffer = () => function* (it) {
    const acc = [];
    for (const el of it) {
        acc.push(el);
    }
    yield acc;
};
exports.buffer = buffer;
//# sourceMappingURL=transform.js.map