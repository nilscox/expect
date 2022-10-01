import { isPromise } from "util/types";
import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";

declare global {
  namespace Expect {
    interface Assertions<Actual> {
      toReject<T>(expectedInstance?: { new (...args: any[]): T }): T;
    }
  }
}

export class ToRejectAssertionError extends AssertionError {
  constructor(
    actual: unknown,
    public readonly expectedInstance?: { new (...args: any[]): unknown },
    public readonly resolved?: unknown
  ) {
    super("toReject", actual);
  }
}

expect.addAssertion({
  name: "toReject",
  guard: isPromise,
  async assert(promise, expectedInstance) {
    let error: ToRejectAssertionError | undefined = undefined;
    let resolved: unknown;

    try {
      resolved = await promise;
      error = new ToRejectAssertionError(undefined, expectedInstance, resolved);
    } catch (caught) {
      if (expectedInstance !== undefined && !(caught instanceof expectedInstance)) {
        error = new ToRejectAssertionError(caught, expectedInstance, resolved);
      } else {
        return caught;
      }
    }

    if (error) {
      throw error;
    }
  },
  formatError(error: ToRejectAssertionError) {
    let message = `expected promise to reject`;

    if (error.expectedInstance) {
      message += ` with an instance of ${error.expectedInstance.name}`;
    }

    if (error.actual === undefined) {
      message += ` but it resolved with ${error.resolved}`;
    } else {
      message += ` but it rejected with ${error.actual}`;
    }

    return message;
  },
});
