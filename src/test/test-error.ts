import assert from "assert";
import { AssertionError } from "../errors/assertion-error";

export const testError = (cb: () => void, expectedError: AssertionError, message: string) => {
  try {
    cb();
    throw new Error("testError: expect did not throw");
  } catch (error) {
    if (error instanceof AssertionError) {
      assert.equal(error.message, message);
      assert.deepEqual(expectedError, Object.assign(error, { message: "assertion error" }));
    } else {
      throw error;
    }
  }
};
