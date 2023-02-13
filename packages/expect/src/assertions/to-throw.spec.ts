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
    testError(() => expect(doNothing).toThrow(), {
      message: 'expected [function doNothing] to throw anything but it did not throw',
      actual: undefined,
    });
  });

  it('function not throwing a specific error', () => {
    testError(() => expect(doNothing).toThrow(error), {
      message: 'expected [function doNothing] to throw [Error: error] but it did not throw',
      actual: undefined,
      expected: error,
    });
  });

  it('function throwing a different error', () => {
    const other = new Error('other');

    testError(() => expect(throwError).toThrow(other), {
      message: 'expected [function throwError] to throw [Error: other] but it threw [Error: error]',
      actual: error,
      expected: other,
    });
  });

  it('matching the error using a matcher', () => {
    expect(throwError).toThrow(expect.objectWith({ message: expect.stringMatching(/^err/) }));
  });

  it('not.toThrow()', () => {
    expect(doNothing).not.toThrow();
    testError(
      () => expect(throwError).not.toThrow(),
      'expected [function throwError] not to throw anything but it did'
    );

    testError(
      () => expect(throwError).not.toThrow(error),
      'expected [function throwError] not to throw [Error: error] but it did'
    );
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toThrow;
  });

  it('documentation examples', () => {
    const throwError = () => {
      throw new Error('oops');
    };

    const doNothing = () => {};

    expect(throwError).toThrow();
    testError(() => expect(doNothing).toThrow());
    expect(throwError).toThrow(new Error('oops'));
    testError(() => expect(throwError).toThrow(new Error('argh')));
    expect(throwError).toThrow(expect.objectWith({ message: expect.stringMatching(/oo/) }));
  });
});
