"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
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
function pipe(a, ...fns) {
    return fns.reduce((x, f) => f(x), a);
}
exports.pipe = pipe;
//# sourceMappingURL=pipe.js.map