import assert from 'assert';
import { ExpectError } from '../errors/expect-error';

export const testError = (callback: () => void, message?: string) => {
  try {
    callback();
    throw new Error('testError: callback did not throw');
  } catch (error) {
    if (message === undefined) {
      return;
    }

    if (error instanceof ExpectError) {
      assert.equal(message, error.message);
    } else {
      throw error;
    }
  }
};

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
