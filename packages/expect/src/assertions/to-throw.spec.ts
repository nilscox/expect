import assert from 'assert';
import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toThrow', () => {
  const error = new Error('error');

  const doNothing = () => {};

  const throwError = () => {
    throw error;
  };

  it('function throwing any error', () => {
    expect(throwError).toThrow();
  });

  it('returns the thrown error', () => {
    assert.strictEqual(expect(throwError).toThrow(), error);
  });

  it('function throwing a specific error', () => {
    expect(throwError).toThrow(error);
  });

  it('function not throwing any error', () => {
    testError(() => expect(doNothing).toThrow(), 'expected doNothing to throw anything but it did not throw');
  });

  it('function not throwing a specific error', () => {
    testError(
      () => expect(doNothing).toThrow(error),
      'expected doNothing to throw Error: error but it did not throw'
    );
  });

  it('function throwing a different error', () => {
    const other = new Error('other');

    testError(
      () => expect(throwError).toThrow(other),
      'expected throwError to throw Error: other but it threw Error: error'
    );
  });

  it('not.toThrow()', () => {
    expect(doNothing).not.toThrow();
    testError(() => expect(throwError).not.toThrow(), 'expected throwError not to throw anything but it did');

    testError(
      () => expect(throwError).not.toThrow(error),
      'expected throwError not to throw Error: error but it did'
    );
  });
});
