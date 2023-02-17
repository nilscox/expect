import { expect } from '../expect';
import { testError } from '../helpers/test-error';

describe('toBeLessThan', () => {
  it('number being below another number', () => {
    expect(1).toBeLessThan(2);
  });

  it('number being equal to another number', () => {
    testError(() => expect(1).toBeLessThan(1), {
      message: 'expected 1 to be less than 1',
      actual: 1,
      expected: 1,
      meta: { strict: true },
    });
  });

  it('number being above another number', () => {
    testError(() => expect(2).toBeLessThan(1), 'expected 2 to be less than 1');
  });

  describe('strict = true', () => {
    const options = { strict: true };

    it('number being below another number', () => {
      expect(1).toBeLessThan(2, options);
    });

    it('number being equal to another number', () => {
      testError(() => expect(1).toBeLessThan(1, options), 'expected 1 to be less than 1');
    });

    it('number being above another number', () => {
      testError(() => expect(2).toBeLessThan(1, options), 'expected 2 to be less than 1');
    });
  });

  describe('strict = false', () => {
    const options = { strict: false };

    it('number being below another number', () => {
      expect(1).toBeLessThan(2, options);
    });

    it('number being equal to another number', () => {
      expect(1).toBeLessThan(1, options);
    });

    it('number being above another number', () => {
      testError(() => expect(2).toBeLessThan(1, options), {
        message: 'expected 2 to be less or equal to 1',
        actual: 2,
        expected: 1,
        meta: { strict: false },
      });
    });
  });

  it('not.toBeLessThan()', () => {
    expect(2).not.toBeLessThan(1);
    expect(1).not.toBeLessThan(1);
    testError(() => expect(1).not.toBeLessThan(2), 'expected 1 not to be less than 2');
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect('').toBeLessThan;
  });

  it('documentation examples', () => {
    expect(1).toBeLessThan(2);
    testError(() => expect(2).toBeLessThan(1));
  });
});
