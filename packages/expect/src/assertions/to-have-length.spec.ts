import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toHaveLength', () => {
  describe('array', () => {
    it('expected length', () => {
      expect([]).toHaveLength(0);
      expect([1]).toHaveLength(1);
    });

    it('unexpected length', () => {
      testError(() => expect([]).toHaveLength(1), 'expected  to have length 1');
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

  describe('object with a "length" key', () => {
    it('same "length" value', () => {
      expect({ length: 3 }).toHaveLength(3);
    });

    it('different "length" values', () => {
      testError(() => expect({ length: 1 }).toHaveLength(0), 'expected [object Object] to have length 0');
    });
  });

  describe('function number of arguments', () => {
    const func = () => {};

    it('expected number of arguments', () => {
      expect(func).toHaveLength(0);
      expect((_a: number) => {}).toHaveLength(1);
    });

    it('unexpected number of arguments', () => {
      testError(() => expect(func).toHaveLength(1), 'expected func to take 1 argument(s)');
    });
  });

  it('not.toHaveLength', () => {
    expect([]).not.toHaveLength(1);
    testError(() => expect([]).not.toHaveLength(0), 'expected  not to have length 0');
  });
});
