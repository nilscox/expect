import { expect } from '../expect';
import { testError } from '../helpers/test-error';

describe('toHaveLength', () => {
  describe('array', () => {
    it('expected length', () => {
      expect([]).toHaveLength(0);
      expect([1]).toHaveLength(1);
    });

    it('unexpected length', () => {
      testError(() => expect([]).toHaveLength(1), {
        message: 'expected [] to have length 1',
        expected: 1,
        actual: 0,
      });
    });
  });

  describe('string', () => {
    it('expected length', () => {
      expect('a').toHaveLength(1);
    });

    it('unexpected length', () => {
      testError(() => expect('').toHaveLength(1), 'expected "" to have length 1');
    });
  });

  describe('function number of arguments', () => {
    const func = () => {};

    it('expected number of arguments', () => {
      expect(func).toHaveLength(0);
      expect((_a: number) => {}).toHaveLength(1);
    });

    it('unexpected number of arguments', () => {
      testError(() => expect(func).toHaveLength(1), 'expected [function func] to take 1 argument(s)');
    });
  });

  it('not.toHaveLength', () => {
    expect([]).not.toHaveLength(1);
    testError(() => expect([]).not.toHaveLength(0), 'expected [] not to have length 0');
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toHaveLength;
  });

  it('documentation examples', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('hello').toHaveLength(5);
    testError(() => expect([]).toHaveLength(2));
  });
});
