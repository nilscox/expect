import { expect } from '../expect';
import { testError } from '../test/test-error';
import { ToBeLessThanAssertionError } from './to-be-less-than';

describe('toBeLessThan', () => {
  it('number being below another number', () => {
    expect(1).toBeLessThan(2);
  });

  it('number being equal to another number', () => {
    testError(
      () => expect(1).toBeLessThan(1),
      new ToBeLessThanAssertionError(1, 1, true),
      'expected 1 to be less than 1'
    );
  });

  it('number being above another number', () => {
    testError(
      () => expect(2).toBeLessThan(1),
      new ToBeLessThanAssertionError(2, 1, true),
      'expected 2 to be less than 1'
    );
  });

  describe('strict = true', () => {
    const options = { strict: true };

    it('number being below another number', () => {
      expect(1).toBeLessThan(2, options);
    });

    it('number being equal to another number', () => {
      testError(
        () => expect(1).toBeLessThan(1, options),
        new ToBeLessThanAssertionError(1, 1, true),
        'expected 1 to be less than 1'
      );
    });

    it('number being above another number', () => {
      testError(
        () => expect(2).toBeLessThan(1, options),
        new ToBeLessThanAssertionError(2, 1, true),
        'expected 2 to be less than 1'
      );
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
      testError(
        () => expect(2).toBeLessThan(1, options),
        new ToBeLessThanAssertionError(2, 1, false),
        'expected 2 to be less or equal to 1'
      );
    });
  });
});
