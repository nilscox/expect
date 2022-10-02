import assert from 'assert';
import { expect } from './expect';
import { testError, testErrorAsync } from './test/test-error';

describe('async', () => {
  describe('promise runtime type checking', () => {
    it('fails when a promise is given to expect()', async () => {
      testError(
        () => expect(Promise.resolve()).toBeUndefined(),
        'expect(actual).toBeUndefined(): actual must not be a promise, use expect.async(actual) instead'
      );
    });

    it('fails when not a promise is given to expect.async()', async () => {
      await testErrorAsync(
        // @ts-expect-error
        expect.async(42).toEqual(42),
        'expect.async(actual).toEqual(): actual must be a promise, use expect(actual) instead'
      );
    });

    it('fails when not a promise is given to expect.rejects()', async () => {
      await testErrorAsync(
        // @ts-expect-error
        expect.rejects(42).with(Error),
        'expect.rejects(actual).with(): actual must be a promise, use expect(actual) instead'
      );
    });
  });

  describe('resolving promise', () => {
    const promise = () => Promise.resolve(42);

    it('assert on the resolved value', async () => {
      await expect.async(promise()).toEqual(42);
      await expect.async(promise()).not.toBeLessThan(40);
    });

    it('fails when expecting the promise to rejects', async () => {
      await testErrorAsync(
        expect.rejects(promise()).with(Error),
        'expected promise to reject but it resolved with 42'
      );
    });
  });

  describe('rejecting promise', () => {
    class TestError extends Error {}
    const promise = (error: unknown) => Promise.reject(error);

    it('returns the rejected value', async () => {
      const error = new TestError('nope');
      const result = await expect.rejects(promise(error)).with(TestError);

      assert.strictEqual(error, result);
    });

    it("fails when the rejected value's constructor does not match", async () => {
      const error = new Error();

      try {
        await expect.rejects(promise(error)).with(TestError);
      } catch (caught) {
        assert.strictEqual(error, caught);
      }
    });

    it('fails when expecting the promise to resolve', async () => {
      const error = new Error('nope');

      try {
        await expect.async<unknown>(promise(error)).toEqual(42);
        throw new Error('expect.async() did not throw');
      } catch (caught) {
        assert.strictEqual(error, caught);
      }
    });
  });
});
