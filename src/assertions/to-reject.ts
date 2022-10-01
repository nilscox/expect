import { isPromise } from "util/types";
import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { ValueFormatter } from "../helpers/format-value";

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

  format(formatValue: ValueFormatter): string {
    let message = `expected promise to reject`;

    if (this.expectedInstance) {
      message += ` with an instance of ${this.expectedInstance.name}`;
    }

    if (this.actual === undefined) {
      message += ` but it resolved with ${formatValue(this.resolved)}`;
    } else {
      message += ` but it rejected with ${formatValue(this.actual)}`;
    }

    return message;
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
});
