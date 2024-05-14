import { forEach, unwrap, unwrapFirst, unwrapLast, unwrapReduce } from './sink';

describe('forEach', () => {
  it('calls the effect', () => {
    const effect = jest.fn();
    expect(forEach(effect)([2, 3, 4])).toBeUndefined();
    expect(effect).toHaveBeenCalledTimes(3);
    expect(effect).toHaveBeenNthCalledWith(1, 2, 0);
    expect(effect).toHaveBeenNthCalledWith(2, 3, 1);
    expect(effect).toHaveBeenNthCalledWith(3, 4, 2);
  });
});

describe('unwrap', () => {
  it('throws on empty upstream', () => {
    expect(() => unwrap()([])).toThrow(new TypeError('No values to unwrap.'));
  });

  it('unwraps', () => {
    expect(unwrap()([3, 2, 1].values())).toStrictEqual([3, 2, 1]);
  });
});

describe('unwrapFirst', () => {
  it('throws on empty upstream', () => {
    expect(() => unwrapFirst()([])).toThrow(
      new TypeError('Tried to unwrap first element from empty iterator.'),
    );
  });

  it('returns first element', () => {
    expect(unwrapFirst()([42, 1, 2, 3])).toBe(42);
  });
});

describe('unwrapLast', () => {
  it('throws on empty upstream', () => {
    expect(() => unwrapLast()([])).toThrow(
      new TypeError('Tried to unwrap last element from empty iterator.'),
    );
  });

  it('returns last element', () => {
    expect(unwrapLast()([1, 2, 3, 42])).toBe(42);
  });
});

describe('unwrapReduce', () => {
  it('throws on empty upstream and no initial value', () => {
    const fn = jest.fn();
    expect(() => unwrapReduce(fn)([])).toThrow(
      new TypeError('No values to unwrap.'),
    );
    expect(fn).not.toHaveBeenCalled();
  });

  it('returns initial value on empty upstream', () => {
    const fn = jest.fn();
    expect(unwrapReduce(fn, 42)([])).toBe(42);
    expect(fn).not.toHaveBeenCalled();
  });

  it('uses first element as initial value', () => {
    const sum = jest.fn((acc: number, val: number) => acc + val);
    expect(unwrapReduce(sum)([2, 1, 3])).toBe(6);
    expect(sum).toHaveBeenNthCalledWith(1, 2, 1);
  });

  it('uses the provided initial value', () => {
    const sum = jest.fn((acc: number, val: number) => acc + val);
    expect(unwrapReduce(sum, 42)([1, 2, 3])).toBe(48);
    expect(sum).toHaveBeenNthCalledWith(1, 42, 1);
  });
});
