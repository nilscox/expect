import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isFunction } from "../errors/guard-error";
import { deepEqual } from "../helpers/deep-equal";

declare global {
  namespace Expect {
    interface Assertions<Actual> {
      toThrow(expected?: unknown): Actual | Promise<Actual>;
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
  expectedType: "a function",
  guard: isFunction,
  assert(func: Function, expected?: unknown) {
    let error: Error | undefined = undefined;
    let actual: unknown;

    try {
      func();
      error = new ToThrowAssertionError(undefined, func, expected);
    } catch (caught) {
      actual = caught;

      if (expected !== undefined && !deepEqual(expected, caught)) {
        error = new ToThrowAssertionError(caught, func, expected);
      }
    }

    if (error) {
      throw error;
    }

    return actual;
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
