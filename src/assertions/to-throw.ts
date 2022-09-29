import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isFunction } from "../errors/guard-error";
import { deepEqual } from "../helpers/deep-equal";

declare global {
  namespace Expect {
    interface FunctionAssertions {
      toThrow(expected?: unknown): void;
    }
  }
}

export class ToThrowAssertionError extends AssertionError {
  constructor(actual: unknown, public readonly func: Function, public readonly expected: unknown) {
    super("toThrow", actual);
  }
}

expect.addAssertion({
  name: "toThrow",
  guard: isFunction("toThrow"),
  execute(func: Function, expected?: unknown) {
    let error: Error | undefined = undefined;

    try {
      func();
      error = new ToThrowAssertionError(undefined, func, expected);
    } catch (actual) {
      if (expected !== undefined && !deepEqual(expected, actual)) {
        error = new ToThrowAssertionError(actual, func, expected);
      }
    }

    if (error) {
      throw error;
    }
  },
  formatError(error: ToThrowAssertionError) {
    const message = `expected ${error.func.name || "function"} to throw ${error.expected ?? "anything"}`;

    if (error.actual === undefined) {
      return `${message} but it did not throw`;
    } else {
      return `${message} but it threw ${error.actual}`;
    }
  },
});
