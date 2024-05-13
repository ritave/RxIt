import { empty, generate, just, of, range } from './source';
import { take } from './transform';

describe('empty', () => {
  it('returns empty iterator', () => {
    expect([...empty()]).toStrictEqual([]);
  });
});

describe('range', () => {
  it('starts from `start`', () => {
    expect([...take(3)(range(3))]).toStrictEqual([3, 4, 5]);
  });

  it('emits `count` items', () => {
    expect([...range(2, 4)]).toStrictEqual([2, 3, 4, 5]);
  });
});

describe('generate', () => {
  it('generates', () => {
    const initialState = 2;
    const iterate = jest.fn((val: number) => val * 2);
    expect([...take(3)(generate({ initialState, iterate }))]).toStrictEqual([
      2, 4, 8,
    ]);

    expect(iterate).toHaveBeenCalledTimes(3);
    expect(iterate).toHaveBeenNthCalledWith(1, 2, 0);
    expect(iterate).toHaveBeenNthCalledWith(2, 4, 1);
    expect(iterate).toHaveBeenNthCalledWith(3, 8, 2);
  });

  it("stops after condition doesn't hold", () => {
    const initialState = 2;
    const iterate = jest.fn((val: number) => val * 3);
    const condition = jest.fn((val: number) => val <= 18);
    expect([...generate({ initialState, iterate, condition })]).toStrictEqual([
      2, 6, 18,
    ]);

    expect(iterate).toHaveBeenCalledTimes(3);
    expect(iterate).toHaveBeenNthCalledWith(1, 2, 0);
    expect(iterate).toHaveBeenNthCalledWith(2, 6, 1);
    expect(iterate).toHaveBeenNthCalledWith(3, 18, 2);

    expect(condition).toHaveBeenCalledTimes(4);
    expect(condition).toHaveBeenNthCalledWith(1, 2, 0);
    expect(condition).toHaveBeenNthCalledWith(2, 6, 1);
    expect(condition).toHaveBeenNthCalledWith(3, 18, 2);
    expect(condition).toHaveBeenNthCalledWith(4, 54, 3);
  });

  it('transform value using selector', () => {
    const initialState = { value: 2, foo: 1 };
    const iterate = ({ value, foo }: typeof initialState) => ({
      value: value * 2,
      foo: foo * 3,
    });
    const resultSelector = jest.fn(({ value }: typeof initialState) => value);

    expect([
      ...take(3)(generate({ initialState, iterate, resultSelector })),
    ]).toStrictEqual([2, 4, 8]);

    expect(resultSelector).toHaveBeenCalledTimes(4);
    expect(resultSelector).toHaveBeenNthCalledWith(1, { value: 2, foo: 1 }, 0);
    expect(resultSelector).toHaveBeenNthCalledWith(2, { value: 4, foo: 3 }, 1);
    expect(resultSelector).toHaveBeenNthCalledWith(3, { value: 8, foo: 9 }, 2);
    expect(resultSelector).toHaveBeenNthCalledWith(
      4,
      { value: 16, foo: 27 },
      3,
    );
  });
});

describe('just', () => {
  it('emits a value', () => {
    expect([...just(42)]).toStrictEqual([42]);
  });

  it("doesn't unroll", () => {
    expect([...just([1, 2, 3])]).toStrictEqual([[1, 2, 3]]);
  });
});

describe('of', () => {
  it('emits values', () => {
    expect([...of(1, 2, 3)]).toStrictEqual([1, 2, 3]);
  });

  it("doesn't unroll", () => {
    expect([...of<number | number[]>(1, [1, 2], [3, 4])]).toStrictEqual([
      1,
      [1, 2],
      [3, 4],
    ]);
  });
});
