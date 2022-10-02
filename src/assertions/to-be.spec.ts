import { expect } from '../expect';
import { testError } from '../test/test-error';
import { ToBeAssertionError } from './to-be';

describe('toBe', () => {
  it('same primitive type', () => {
    expect(1).toBe(1);
  });

  it('different primitive types', () => {
    testError(() => expect(1).toBe(2), new ToBeAssertionError(1, 2), 'expected 1 to be 2');
  });

  it('same object reference', () => {
    const object = {};
    expect(object).toBe(object);
  });

  it('different object references', () => {
    testError(
      () => expect({}).toBe({}),
      new ToBeAssertionError({}, {}),
      'expected [object Object] to be [object Object]'
    );
  });
});
