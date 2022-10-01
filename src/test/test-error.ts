import assert from "assert";
import { AssertionError } from "../errors/assertion-error";

export const testError = (callback: () => void, expectedError: AssertionError, message: string) => {
  try {
    callback();
    throw new Error("testError: callback did not throw");
  } catch (error) {
    if (error instanceof AssertionError) {
      assert.equal(error.message, message);
      assert.deepEqual(expectedError, Object.assign(error, { message: expectedError.message }));
    } else {
      throw error;
    }
  }
};

export const testErrorAsync = async (
  promise: Promise<unknown>,
  expectedError: AssertionError,
  message: string
) => {
  try {
    await promise;
    throw new Error("testError: promise did not reject");
  } catch (error) {
    if (error instanceof AssertionError) {
      assert.equal(error.message, message);
      assert.deepEqual(expectedError, Object.assign(error, { message: expectedError.message }));
    } else {
      throw error;
    }
  }
};
