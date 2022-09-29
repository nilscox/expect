import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";

declare global {
  namespace Expect {
    interface GenericAssertions<T = unknown> {
      toBe(expected: T): void;
    }
  }
}

export class ToBeAssertionError<T> extends AssertionError<T> {
  constructor(actual: T, public readonly expected: T) {
    super("toBe", actual);
  }
}

expect.addAssertion({
  name: "toBe",
  execute<T>(actual: T, expected: T) {
    if (!Object.is(actual, expected)) {
      throw new ToBeAssertionError(actual, expected);
    }
  },
  formatError(error: ToBeAssertionError<unknown>) {
    return `expected ${this.formatValue(error.actual)} to be ${this.formatValue(error.expected)}`;
  },
});
