import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isNumber } from "../errors/guard-error";

declare global {
  namespace Expect {
    interface Assertions {
      toBeMoreThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

export class ToBeMoreThanAssertionError extends AssertionError<number> {
  constructor(actual: number, public readonly value: number, public readonly strict: boolean) {
    super("toBeMoreThan", actual);
  }
}

expect.addAssertion({
  name: "toBeMoreThan",
  expectedType: "number",
  guard: isNumber,
  assert(actual: number, value, { strict = true } = {}) {
    if (actual < value || (strict && actual == value)) {
      throw new ToBeMoreThanAssertionError(actual, value, strict);
    }
  },
  formatError(error: ToBeMoreThanAssertionError) {
    if (!error.strict) {
      return `expected ${error.actual} to be more or equal to ${error.value}`;
    }

    return `expected ${error.actual} to be more than ${error.value}`;
  },
});
