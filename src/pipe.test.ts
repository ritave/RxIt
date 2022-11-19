import { pipe } from './pipe';

describe('pipe', () => {
  it('works as identity', () => {
    expect(pipe(42)).toBe(42);
  });

  it("doesn't unroll initial element", () => {
    const fn = jest.fn((value) => value);
    expect(pipe([1, 2, 3], fn)).toStrictEqual([1, 2, 3]);
    expect(fn).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('passes down value through functions', () => {
    const add = jest.fn((value: number) => value + 1);
    const mul = jest.fn((value: number) => value * 2);
    const identity = jest.fn((value: number) => value);
    expect(pipe(20, add, mul, identity)).toBe(42);
    expect(add).toHaveBeenCalledWith(20);
    expect(mul).toHaveBeenCalledWith(21);
    expect(identity).toHaveBeenCalledWith(42);
  });
});
