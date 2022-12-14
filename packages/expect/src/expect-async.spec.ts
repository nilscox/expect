import assert from 'assert';
import { ExpectError } from './errors/expect-error';
import { expect } from './expect';
import { testError } from './test/test-error';

export const testErrorAsync = async (promise: Promise<unknown>, message: string) => {
  try {
    await promise;
    throw new Error('testErrorAsync: promise did not reject');
  } catch (error) {
    if (error instanceof ExpectError) {
      assert.equal(error.message, message);
    } else {
      throw error;
    }
  }
};

describe('async', () => {
  describe('promise runtime type checking', () => {
    it('fails when a promise is given to expect()', async () => {
      testError(
        () => expect(Promise.resolve()).not.toBeDefined(),
        'expect(actual).toBeDefined(): actual must not be a promise, use expect.async(actual) instead'
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

    it('checks the rejected value', async () => {
      const error = new Error();

      await expect.rejects(promise(error)).with(error);
    });

    it('checks the rejected value with a matcher', async () => {
      await expect.rejects(promise('error')).with(expect.stringMatching(/^err/));

      await testErrorAsync(
        expect.rejects(promise('error')).with(new Error('nope')),
        'expected "error" to equal [Error: nope]'
      );
    });

    it("checks the rejected value's constructor", async () => {
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
