import assert from 'assert';

import { pipe } from './pipe';
import { unwrap } from './sink';
import { range } from './source';
import {
  buffer,
  bufferToggle,
  count,
  defaultIfEmpty,
  distinct,
  distinctUntilChanged,
  elementAt,
  endWith,
  every,
  filter,
  find,
  flatMap,
  map,
  reduce,
  repeat,
  skip,
  skipWhile,
  sort,
  startWith,
  take,
  takeWhile,
  tap,
} from './transform';

describe('count', () => {
  it('counts elements', () => {
    expect([...count()([1, 1, 1, 2, 3, 4])]).toStrictEqual([6]);
  });

  it('returns zero on empty', () => {
    expect([...count()([])]).toStrictEqual([0]);
  });
});

describe('defaultIfEmpty', () => {
  it('re-emits upstream', () => {
    expect([...defaultIfEmpty(42)([1, 2, 3])]).toStrictEqual([1, 2, 3]);
  });

  it('emits default value', () => {
    expect([...defaultIfEmpty(42)([])]).toStrictEqual([42]);
  });
});

describe('distinct', () => {
  it('emits unique values', () => {
    expect([
      ...distinct()([1, 1, 2, 2, 1, 3, 2, 1, 2, 3, 4, 1, 2, 3, 4]),
    ]).toStrictEqual([1, 2, 3, 4]);
  });

  it('uses key function', () => {
    expect([
      ...distinct<[number, number]>(([first]) => first)([
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 1],
        [2, 2],
        [3, 4],
        [3, 1],
      ]),
    ]).toStrictEqual([
      [1, 2],
      [2, 1],
      [3, 4],
    ]);
  });
});

describe('distinctUntilChanged', () => {
  it('emits unique values', () => {
    expect([
      ...distinctUntilChanged()([1, 1, 2, 1, 2, 3, 3, 1, 4, 4, 4]),
    ]).toStrictEqual([1, 2, 1, 2, 3, 1, 4]);
  });

  it('uses comparator', () => {
    expect([
      ...distinctUntilChanged<number | string>(
        (a, b) => a.toString() === b.toString(),
      )([1, '1', '2', 2, '1']),
    ]).toStrictEqual([1, '2', '1']);
  });

  it('uses key selector', () => {
    expect([
      ...distinctUntilChanged<[number, number], number>(
        undefined,
        ([first]) => first,
      )([
        [1, 2],
        [1, 3],
        [2, 3],
        [2, 1],
        [3, 4],
        [3, 1],
      ]),
    ]).toStrictEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });

  it('uses key selector and comparator', () => {
    expect([
      ...distinctUntilChanged<[number | string, number], number | string>(
        (a, b) => a.toString() === b.toString(),
        ([first]) => first,
      )([
        [1, 2],
        ['1', 3],
        ['2', 3],
        [2, 1],
        [3, 4],
        ['3', 1],
      ]),
    ]).toStrictEqual([
      [1, 2],
      ['2', 3],
      [3, 4],
    ]);
  });

  it("doesn't pass symbol to comparator", () => {
    expect(() => [
      ...distinctUntilChanged((a, b) => {
        assert(typeof a !== 'symbol' && typeof b !== 'symbol');
        assert(
          typeof a === 'number' &&
            typeof b === 'number' &&
            a >= 1 &&
            a <= 3 &&
            b >= 1 &&
            b <= 3,
        );
        return a === b;
      })([1, 1, 2, 3, 1, 2, 3]),
    ]).not.toThrow();
  });
});

describe('elementAt', () => {
  it('throws RangeError', () => {
    expect(() => [...elementAt(4)([1, 2, 3])]).toThrow(
      new RangeError('Iterator finished before expected index.'),
    );
  });

  it('returns on index', () => {
    expect([...elementAt(3)([2, 3, 4, 5, 6, 7])]).toStrictEqual([5]);
  });
});

describe('every', () => {
  it('returns true if satisfied', () => {
    expect([
      ...every((el: number) => el % 5 === 0)([5, 10, 15, 20]),
    ]).toStrictEqual([true]);
  });

  it('returns false if not satisfied', () => {
    expect([
      ...every((el: number) => el % 5 === 0)([5, 10, 18, 20]),
    ]).toStrictEqual([false]);
  });
});

describe('sort', () => {
  it('sorts', () => {
    expect([...sort()(['c', 'b', 'a'])]).toStrictEqual(['a', 'b', 'c']);
  });

  it('uses javascript sort semantics', () => {
    expect([...sort()([2, 10, 1])]).toStrictEqual([1, 10, 2]);
  });

  it('uses compare function', () => {
    expect([...sort<number>((a, b) => b - a)([1, 2, 3])]).toStrictEqual([
      3, 2, 1,
    ]);
  });
});

describe('map', () => {
  it('maps', () => {
    expect([...map((value: number) => value * 2)([1, 2, 3])]).toStrictEqual([
      2, 4, 6,
    ]);
  });
});

describe('flatMap', () => {
  it('flattens', () => {
    const mapping = jest.fn((value: number) => range(value, value));
    expect([...flatMap(mapping)([2, 3, 4])]).toStrictEqual([
      // 2
      2, 3,
      // 3
      3, 4, 5,
      // 4
      4, 5, 6, 7,
    ]);

    expect(mapping).toHaveBeenCalledTimes(3);
    expect(mapping).toHaveBeenNthCalledWith(1, 2, 0);
    expect(mapping).toHaveBeenNthCalledWith(2, 3, 1);
    expect(mapping).toHaveBeenNthCalledWith(3, 4, 2);
  });
});

describe('tap', () => {
  it('taps', () => {
    const fn = jest.fn();
    expect([...tap(fn)([1, 2, 3])]).toStrictEqual([1, 2, 3]);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn).toHaveBeenNthCalledWith(1, 1, 0);
    expect(fn).toHaveBeenNthCalledWith(2, 2, 1);
    expect(fn).toHaveBeenNthCalledWith(3, 3, 2);
  });

  it('ignores return value', () => {
    const fn = jest.fn(() => 42);
    expect([...tap(fn)([1, 2, 3])]).toStrictEqual([1, 2, 3]);
  });
});

describe('find', () => {
  it('returns nothing on always false', () => {
    expect([...find(() => false)([1, 2, 3])]).toStrictEqual([]);
  });

  it('returns first found value', () => {
    expect([
      ...find((val: number) => val % 2 === 0)([1, 3, 5, 6, 3, 1]),
    ]).toStrictEqual([6]);
  });

  it('returns only first value', () => {
    expect([
      ...find((val: number) => val % 5 === 0)([1, 2, 3, 5, 6, 10, 15, 20]),
    ]).toStrictEqual([5]);
  });
});

describe('filter', () => {
  it('returns everything on true', () => {
    expect([...filter(() => true)([1, 2, 3])]).toStrictEqual([1, 2, 3]);
  });

  it('returns nothing on false', () => {
    expect([...filter(() => false)([1, 2, 3])]).toStrictEqual([]);
  });

  it('filters based on predicate', () => {
    expect([
      ...filter((val: number) => val % 2 === 0)([2, 3, 4, 5, 6]),
    ]).toStrictEqual([2, 4, 6]);
  });
});

describe('take', () => {
  it('emits 1 by default', () => {
    expect([...take()([42, 43, 44])]).toStrictEqual([42]);
  });

  it('takes only count elements', () => {
    expect([...take(3)([2, 4, 5, 6, 7])]).toStrictEqual([2, 4, 5]);
  });

  it('returns up-to count', () => {
    expect([...take(10)([1, 2, 3])]).toStrictEqual([1, 2, 3]);
  });
});

describe('takeWhile', () => {
  it('takes while predicate holds', () => {
    expect([
      ...takeWhile((element) => element !== 42)([1, 2, 42, 3]),
    ]).toStrictEqual([1, 2]);
  });

  it('returns everything when predicate always holds', () => {
    expect([...takeWhile(() => true)([1, 2, 3])]).toStrictEqual([1, 2, 3]);
  });

  it('returns nothing when predicate never holds', () => {
    expect([...takeWhile(() => false)([1, 2, 3])]).toStrictEqual([]);
  });

  it('calls predicate only until first false', () => {
    const predicate = jest.fn((element) => element !== 42);

    pipe([1, 2, 42, 43, 44], takeWhile(predicate), unwrap());

    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenNthCalledWith(1, 1, 0);
    expect(predicate).toHaveBeenNthCalledWith(2, 2, 1);
    expect(predicate).toHaveBeenNthCalledWith(3, 42, 2);
  });
});

describe('skip', () => {
  it('skips 1 by default', () => {
    expect([...skip()([1, 2, 3])]).toStrictEqual([2, 3]);
  });

  it('skips count elements', () => {
    expect([...skip(3)([42, 43, 44, 45, 46])]).toStrictEqual([45, 46]);
  });

  it('returns empty when upstream finishes early', () => {
    expect([...skip(10)([1, 2, 3])]).toStrictEqual([]);
  });
});

describe('skipWhile', () => {
  it('skips while predicate holds', () => {
    expect([
      ...skipWhile((element) => element !== 42)([1, 2, 42, 43, 44]),
    ]).toStrictEqual([42, 43, 44]);
  });

  it('returns nothing when predicate always holds', () => {
    expect([...skipWhile(() => true)([1, 2, 3])]).toStrictEqual([]);
  });

  it('returns everything when predicate never holds', () => {
    expect([...skipWhile(() => false)([1, 2, 3])]).toStrictEqual([1, 2, 3]);
  });

  it('calls predicate only until first false', () => {
    const predicate = jest.fn((element) => element !== 42);

    pipe([1, 2, 42, 43, 44], skipWhile(predicate), unwrap());

    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenNthCalledWith(1, 1, 0);
    expect(predicate).toHaveBeenNthCalledWith(2, 2, 1);
    expect(predicate).toHaveBeenNthCalledWith(3, 42, 2);
  });
});

describe('reduce', () => {
  it('returns empty iterator on empty upstream with no initial value', () => {
    const fn = jest.fn();
    expect([...reduce(fn)([])]).toStrictEqual([]);
    expect(fn).not.toHaveBeenCalled();
  });

  it('emits initial value on empty upstream', () => {
    const fn = jest.fn();
    expect([...reduce(fn, 42)([])]).toStrictEqual([42]);
    expect(fn).not.toHaveBeenCalled();
  });

  it('uses first element as initial value', () => {
    const sum = jest.fn((acc: number, val: number) => acc + val);
    expect([...reduce(sum)([2, 1, 3])]).toStrictEqual([6]);
    expect(sum).toHaveBeenNthCalledWith(1, 2, 1);
  });

  it('uses the provided initial value', () => {
    const sum = jest.fn((acc: number, val: number) => acc + val);
    expect([...reduce(sum, 42)([1, 2, 3])]).toStrictEqual([48]);
    expect(sum).toHaveBeenNthCalledWith(1, 42, 1);
  });
});

describe('repeat', () => {
  it('repeats count times', () => {
    expect([...repeat(3)([1, 2, 3])]).toStrictEqual([
      1, 2, 3, 1, 2, 3, 1, 2, 3,
    ]);
  });

  it('repeats infinitely on undefined count', () => {
    expect([...take(7)(repeat()([1, 2]))]).toStrictEqual([1, 2, 1, 2, 1, 2, 1]);
  });

  it("doesn't repeat on zero count", () => {
    expect([...repeat(0)([1, 2, 3])]).toStrictEqual([]);
  });
});

describe('startWith', () => {
  it('prepends before emitting', () => {
    expect([...startWith(4, 5, 6)([1, 2, 3])]).toStrictEqual([
      4, 5, 6, 1, 2, 3,
    ]);
  });
});

describe('endWith', () => {
  it('append after emitting', () => {
    expect([...endWith(4, 5, 6)([1, 2, 3])]).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('buffer', () => {
  it('returns nothing array on empty upstream', () => {
    expect([...buffer()([])]).toStrictEqual([]);
  });

  it('buffers', () => {
    expect([...buffer()([3, 2, 1])]).toStrictEqual([[3, 2, 1]]);
  });

  it('closes on `close` function', () => {
    const close = jest.fn((val: number) => val % 2 === 0);
    expect([...buffer(close)([2, 3, 4, 5])]).toStrictEqual([[2], [3, 4], [5]]);

    expect(close).toHaveBeenCalledTimes(4);
    expect(close).toHaveBeenNthCalledWith(1, 2, 0, [2]);
    expect(close).toHaveBeenNthCalledWith(2, 3, 1, [3]);
    expect(close).toHaveBeenNthCalledWith(3, 4, 2, [3, 4]);
    expect(close).toHaveBeenNthCalledWith(4, 5, 3, [5]);
  });
});

describe('bufferToggle', () => {
  it('maintains buffers', () => {
    const closes: jest.Mock[] = [];
    // opens buffers on all elements
    // and closes them after opening-index count elements are inside
    const open = jest.fn((_open: number, openIndex: number) => {
      const close = jest.fn(
        (_close: number, closeIndex: number) =>
          closeIndex - openIndex === openIndex,
      );
      closes.push(close);
      return close;
    });

    expect([...bufferToggle(open)([2, 3, 4, 5])]).toStrictEqual([
      [2],
      [3, 4],
      [4, 5],
      [5],
    ]);

    expect(open).toHaveBeenCalledTimes(4);
    expect(open).toHaveBeenNthCalledWith(1, 2, 0);
    expect(open).toHaveBeenNthCalledWith(2, 3, 1);
    expect(open).toHaveBeenNthCalledWith(3, 4, 2);
    expect(open).toHaveBeenNthCalledWith(4, 5, 3);

    expect(closes).toHaveLength(4);

    expect(closes[0]).toHaveBeenCalledTimes(1);
    expect(closes[0]).toHaveBeenNthCalledWith(1, 2, 0, [2]);

    expect(closes[1]).toHaveBeenCalledTimes(2);
    expect(closes[1]).toHaveBeenNthCalledWith(1, 3, 1, [3]);
    expect(closes[1]).toHaveBeenNthCalledWith(2, 4, 2, [3, 4]);

    expect(closes[2]).toHaveBeenCalledTimes(2);
    expect(closes[2]).toHaveBeenNthCalledWith(1, 4, 2, [4]);
    expect(closes[2]).toHaveBeenNthCalledWith(2, 5, 3, [4, 5]);

    expect(closes[3]).toHaveBeenCalledTimes(1);
    expect(closes[3]).toHaveBeenNthCalledWith(1, 5, 3, [5]);
  });

  it('opens buffers only when instructed', () => {
    const open = (val: number) => val % 2 === 0;
    expect([...bufferToggle(open)([2, 3, 4, 5, 6])]).toStrictEqual([
      [2, 3, 4, 5, 6],
      [4, 5, 6],
      [6],
    ]);
  });

  it('opens buffers and closes them', () => {
    const open = (val: number) => {
      if (val % 2 === 1) {
        return (closeVal: number) => closeVal % 2 === 0;
      }
      return false;
    };

    expect([...bufferToggle(open)([1, 2, 3, 4, 5])]).toStrictEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  it("doesn't open buffers on false", () => {
    expect([...bufferToggle(() => false)([2, 3, 4, 5])]).toStrictEqual([]);
  });

  it('opens infinite buffer on true', () => {
    expect([...bufferToggle(() => true)([2, 3, 4, 5])]).toStrictEqual([
      [2, 3, 4, 5],
      [3, 4, 5],
      [4, 5],
      [5],
    ]);
  });
});
