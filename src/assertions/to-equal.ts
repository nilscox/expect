import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { deepEqual } from "../helpers/deep-equal";

declare global {
  namespace Expect {
    interface GenericAssertions<T = unknown> {
      toEqual(expected: T): void;
    }
  }
}

export class ToEqualAssertionError<T> extends AssertionError<T> {
  constructor(actual: T, public readonly expected: T) {
    super("toEqual", actual);
  }
}

expect.addAssertion({
  name: "toEqual",
  execute<T>(actual: T, expected: T) {
    if (!deepEqual(actual, expected)) {
      throw new ToEqualAssertionError(actual, expected);
    }
  },
  formatError(error: ToEqualAssertionError<unknown>) {
    return `expected ${this.formatValue(error.actual)} to equal ${this.formatValue(error.expected)}`;
  },
});
