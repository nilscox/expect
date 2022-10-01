import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isNumber } from "../errors/guard-error";

declare global {
  namespace Expect {
    interface Assertions<Actual> {
      toBeLessThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

export class ToBeLessThanAssertionError extends AssertionError<number> {
  constructor(actual: number, public readonly value: number, public readonly strict: boolean) {
    super("toBeLessThan", actual);
  }
}

expect.addAssertion({
  name: "toBeLessThan",
  expectedType: "number",
  guard: isNumber,
  assert(actual: number, value: number, { strict = true } = {}) {
    if (actual > value || (strict && actual == value)) {
      throw new ToBeLessThanAssertionError(actual, value, strict);
    }
  },
  formatError(error: ToBeLessThanAssertionError) {
    if (!error.strict) {
      return `expected ${error.actual} to be less or equal to ${error.value}`;
    }

    return `expected ${error.actual} to be less than ${error.value}`;
  },
});
