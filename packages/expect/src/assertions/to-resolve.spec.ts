import assert from 'assert';

import { expect } from '../expect';
import { testErrorAsync } from '../helpers/test-error';

describe('toResolve', () => {
  it('resolving promise', async () => {
    await expect(Promise.resolve(42)).toResolve();
    await expect(Promise.resolve('hello')).toResolve();
  });

  it('forwards the resolved value', async () => {
    assert.equal(await expect(Promise.resolve(42)).toResolve(), 42);
    assert.equal(await expect(Promise.resolve('hello')).toResolve(), 'hello');
  });

  it('non-resolving promise', async () => {
    const error = new Error('nope');

    await testErrorAsync(expect(Promise.reject(42)).toResolve(), {
      message: 'expected promise to resolve but it rejected with 42',
      meta: { error: 42 },
    });

    await testErrorAsync(expect(Promise.reject(error)).toResolve(), {
      message: 'expected promise to resolve but it rejected with [Error: nope]',
      meta: { error },
    });

    await testErrorAsync(expect(Promise.reject<number>(error)).toResolve(42), {
      message: 'expected promise to resolve with 42 but it rejected with [Error: nope]',
      expected: 42,
      meta: { error },
    });
  });

  it('assert on the resolved value', async () => {
    await expect(Promise.resolve(42)).toResolve(42);
    await expect(Promise.resolve('hello')).toResolve('hello');
    await expect(Promise.resolve({ foo: 'bar' })).toResolve({ foo: 'bar' });
  });

  it('asserts with a matcher', async () => {
    await expect(Promise.resolve('hello')).toResolve(expect.stringMatching(/^hell/));

    await testErrorAsync(expect(Promise.resolve('hello')).toResolve(expect.stringMatching(/^heaven/)), {
      message: 'expected promise to resolve with a string matching /^heaven/ but it resolved with "hello"',
      expected: expect.stringMatching(/^heaven/),
      actual: 'hello',
    });
  });

  it('fails when the resolved value do not match', async () => {
    await testErrorAsync(expect(Promise.resolve(42)).toResolve(51), {
      message: 'expected promise to resolve with 51 but it resolved with 42',
      expected: 51,
      actual: 42,
    });
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toResolve;
  });
});
