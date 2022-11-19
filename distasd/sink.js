"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapReduce = exports.unwrapFirst = exports.unwrap = exports.forEach = void 0;
const transform_1 = require("./transform");
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
const forEach = (effect) => function (it) {
    let i = 0;
    for (const el of it) {
        effect(el, i);
        i += 1;
    }
};
exports.forEach = forEach;
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
const unwrap = () => function (it) {
    return [...(0, transform_1.buffer)()(it)][0];
};
exports.unwrap = unwrap;
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
const unwrapFirst = () => function (it) {
    const next = it[Symbol.iterator]().next();
    if (next.done) {
        throw new TypeError('Tried to unwrap first element from empty iterator.');
    }
    return next.value;
};
exports.unwrapFirst = unwrapFirst;
/**
 * Takes an iterator, reduces it's values using standard semantics of array.reduce and returns a single value.
 *
 * @throws {@link TypeError}. In case the upstream was empty.
 * @param args - Standard array.reduce arguments.
 * @returns A single reduced value.
 */
function unwrapReduce(...args) {
    return function (it) {
        let reduced;
        // reduce can pass `undefined` as initial value.
        // It uses number of arguments to discern whether undefined was passed or not.
        switch (args.length) {
            case 1:
                reduced = (0, exports.unwrap)()((0, transform_1.reduce)(args[0])(it));
                break;
            case 2:
                reduced = (0, exports.unwrap)()((0, transform_1.reduce)(args[0], args[1])(it));
                break;
            /* c8 ignore start */
            default:
                ((_) => {
                    throw new Error('Unreachable');
                })(args);
            /* c8 ignore end */
        }
        if (reduced.length !== 1) {
            throw new TypeError('Reduce with no initial value and empty upstream.');
        }
        return reduced[0];
    };
}
exports.unwrapReduce = unwrapReduce;
//# sourceMappingURL=sink.js.map