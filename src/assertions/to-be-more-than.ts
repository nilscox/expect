import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isNumber } from "../errors/guard-error";

declare global {
  namespace Expect {
    interface NumberAssertions {
      toBeMoreThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

const name = "toBeMoreThan";

export class ToBeMoreThanAssertionError extends AssertionError<number> {
  constructor(actual: number, public readonly value: number, public readonly strict: boolean) {
    super(name, actual);
  }
}

expect.addAssertion({
  name,
  guard: isNumber(name),
  execute(actual: number, value: number, { strict = true } = {}) {
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
