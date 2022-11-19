"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.just = exports.generate = exports.range = void 0;
function* range(start, count) {
    let at = start;
    let i = 0;
    while (count === undefined || i < count) {
        yield at;
        at += 1;
        i += 1;
    }
}
exports.range = range;
function* generate(options) {
    var _a, _b;
    let i = 0;
    let state = options.initialState;
    while ((_b = (_a = options.condition) === null || _a === void 0 ? void 0 : _a.call(options, state, i)) !== null && _b !== void 0 ? _b : true) {
        if ('resultSelector' in options) {
            yield options.resultSelector(state, i);
        }
        else {
            yield state;
        }
        state = options.iterate(state, i);
        i += 1;
    }
}
exports.generate = generate;
function* just(value) {
    yield value;
}
exports.just = just;
//# sourceMappingURL=source.js.map