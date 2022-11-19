import { pipe } from './pipe';
import { unwrap } from './sink';
import {
  buffer,
  filter,
  map,
  reduce,
  skip,
  skipWhile,
  sort,
  take,
  takeWhile,
  tap,
} from './transform';

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

describe('buffer', () => {
  it('returns empty array on empty upstream', () => {
    expect([...buffer()([])]).toStrictEqual([[]]);
  });

  it('buffers', () => {
    expect([...buffer()([3, 2, 1])]).toStrictEqual([[3, 2, 1]]);
  });
});
