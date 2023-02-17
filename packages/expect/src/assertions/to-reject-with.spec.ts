import assert from 'assert';

import { expect } from '../expect';
import { testErrorAsync } from '../helpers/test-error';

describe('toRejectWith', () => {
  it('rejecting promise', async () => {
    await expect(Promise.reject(42)).toRejectWith(Number);
    await expect(Promise.reject(new Error('nope'))).toRejectWith(Error);
  });

  it('forwards the rejected value', async () => {
    const error = new Error('nope');

    assert.equal(await expect(Promise.reject(42)).toRejectWith(Number), 42);
    assert.equal(await expect(Promise.reject(error)).toRejectWith(Error), error);
  });

  it('non-rejecting promise', async () => {
    await testErrorAsync(expect(Promise.resolve(42)).toRejectWith(Number), {
      message: 'expected promise to reject with an instance of Number but it resolved with 42',
      expected: Number,
      meta: {
        didThrow: false,
        resolved: 42,
        error: undefined,
      },
    });

    await testErrorAsync(expect(Promise.resolve(42)).toRejectWith(Error), {
      message: 'expected promise to reject with an instance of Error but it resolved with 42',
      expected: Error,
      meta: {
        didThrow: false,
        resolved: 42,
        error: undefined,
      },
    });
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toRejectWith;
  });

  it('not.toRejectWith', async () => {
    const error = new Error('nope');

    await expect(Promise.resolve(42)).not.toRejectWith(String);
    await expect(Promise.reject(error)).not.toRejectWith(String);

    await testErrorAsync(
      expect(Promise.reject(error)).not.toRejectWith(Error),
      'expected promise not to reject with an instance of Error but it did'
    );
  });
});
