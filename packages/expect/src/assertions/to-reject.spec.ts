import assert from 'assert';

import { expect } from '../expect';
import { testErrorAsync } from '../helpers/test-error';

describe('toReject', () => {
  it('rejecting promise', async () => {
    await expect(Promise.reject(42)).toReject();
    await expect(Promise.reject(new Error('nope'))).toReject();
  });

  it('forwards the rejected value', async () => {
    const error = new Error('nope');

    assert.equal(await expect(Promise.reject(42)).toReject(), 42);
    assert.equal(await expect(Promise.reject(error)).toReject(), error);
  });

  it('non-rejecting promise', async () => {
    await testErrorAsync(expect(Promise.resolve(42)).toReject(), {
      message: 'expected promise to reject but it resolved with 42',
      meta: 42,
    });

    await testErrorAsync(expect(Promise.resolve(42)).toReject(51), {
      message: 'expected promise to reject with 51 but it resolved with 42',
      meta: 42,
      expected: 51,
    });
  });

  it('assert on the rejected value', async () => {
    const error = new Error('nope');

    await expect(Promise.reject(42)).toReject(42);
    await expect(Promise.reject(error)).toReject(error);
  });

  it('asserts with a matcher', async () => {
    await expect(Promise.reject('hello')).toReject(expect.stringMatching(/^hell/));

    await testErrorAsync(expect(Promise.reject('hello')).toReject(expect.stringMatching(/^heaven/)), {
      message: 'expected promise to reject with a string matching /^heaven/ but it rejected with "hello"',
      expected: expect.stringMatching(/^heaven/),
      actual: 'hello',
    });
  });

  it('fails when the resolved value do not match', async () => {
    await testErrorAsync(expect(Promise.reject(42)).toReject(51), {
      message: 'expected promise to reject with 51 but it rejected with 42',
      expected: 51,
      actual: 42,
    });
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toReject;
  });

  it('not.toReject', async () => {
    const error = new Error('nope');

    await expect(Promise.resolve(42)).not.toReject();
    await expect(Promise.reject(error)).not.toReject(new Error('other'));

    await testErrorAsync(expect(Promise.reject(error)).not.toReject(), {
      message: 'expected promise not to reject but it did',
      actual: error,
    });

    await testErrorAsync(expect(Promise.reject(error)).not.toReject(error), {
      message: 'expected promise not to reject with [Error: nope] but it did',
      actual: error,
      expected: error,
    });
  });
});
