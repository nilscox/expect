import { expect } from '../expect';
import { testError } from '../test/test-error';
import { ToBeMoreThanAssertionError } from './to-be-more-than';

describe('toBeMoreThan', () => {
  it('number being below another number', () => {
    testError(
      () => expect(1).toBeMoreThan(2),
      new ToBeMoreThanAssertionError(1, 2, true),
      'expected 1 to be more than 2'
    );
  });

  it('number being equal to another number', () => {
    testError(
      () => expect(1).toBeMoreThan(1),
      new ToBeMoreThanAssertionError(1, 1, true),
      'expected 1 to be more than 1'
    );
  });

  it('number being above another number', () => {
    expect(2).toBeMoreThan(1);
  });

  describe('strict = true', () => {
    const options = { strict: true };

    it('number being below another number', () => {
      testError(
        () => expect(1).toBeMoreThan(2, options),
        new ToBeMoreThanAssertionError(1, 2, true),
        'expected 1 to be more than 2'
      );
    });

    it('number being equal to another number', () => {
      testError(
        () => expect(1).toBeMoreThan(1, options),
        new ToBeMoreThanAssertionError(1, 1, true),
        'expected 1 to be more than 1'
      );
    });

    it('number being above another number', () => {
      expect(2).toBeMoreThan(1, options);
    });
  });

  describe('strict = false', () => {
    const options = { strict: false };

    it('number being below another number', () => {
      testError(
        () => expect(1).toBeMoreThan(2, options),
        new ToBeMoreThanAssertionError(1, 2, false),
        'expected 1 to be more or equal to 2'
      );
    });

    it('number being equal to another number', () => {
      expect(1).toBeMoreThan(1, options);
    });

    it('number being above another number', () => {
      expect(2).toBeMoreThan(1, options);
    });
  });
});
