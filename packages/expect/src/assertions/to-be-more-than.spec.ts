import { expect } from '../expect';
import { testError } from '../helpers/test-error';

describe('toBeMoreThan', () => {
  it('number being below another number', () => {
    testError(() => expect(1).toBeMoreThan(2), {
      message: 'expected 1 to be more than 2',
      expected: 2,
      actual: 1,
      meta: { strict: true },
    });
  });

  it('number being equal to another number', () => {
    testError(() => expect(1).toBeMoreThan(1), 'expected 1 to be more than 1');
  });

  it('number being above another number', () => {
    expect(2).toBeMoreThan(1);
  });

  describe('strict = true', () => {
    const options = { strict: true };

    it('number being below another number', () => {
      testError(() => expect(1).toBeMoreThan(2, options), 'expected 1 to be more than 2');
    });

    it('number being equal to another number', () => {
      testError(() => expect(1).toBeMoreThan(1, options), 'expected 1 to be more than 1');
    });

    it('number being above another number', () => {
      expect(2).toBeMoreThan(1, options);
    });
  });

  describe('strict = false', () => {
    const options = { strict: false };

    it('number being below another number', () => {
      testError(() => expect(1).toBeMoreThan(2, options), {
        message: 'expected 1 to be more or equal to 2',
        expected: 2,
        actual: 1,
        meta: {
          strict: false,
        },
      });
    });

    it('number being equal to another number', () => {
      expect(1).toBeMoreThan(1, options);
    });

    it('number being above another number', () => {
      expect(2).toBeMoreThan(1, options);
    });
  });

  it('not.toBeMoreThan()', () => {
    expect(1).not.toBeMoreThan(2);
    expect(1).not.toBeMoreThan(1);
    testError(() => expect(2).not.toBeMoreThan(1), 'expected 2 not to be more than 1');
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect('').toBeMoreThan;
  });

  it('documentation examples', () => {
    testError(() => expect(1).toBeMoreThan(1));
    expect(1).toBeMoreThan(1, { strict: false });
  });
});
