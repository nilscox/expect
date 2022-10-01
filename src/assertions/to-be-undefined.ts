import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";

declare global {
  namespace Expect {
    interface Assertions {
      toBeUndefined(): void;
    }
  }
}

class ToBeUndefinedAssertionError extends AssertionError {
  constructor(actual: unknown) {
    super("toBeUndefined", actual);
  }
}

expect.addAssertion({
  name: "toBeUndefined",
  assert(actual) {
    if (actual !== undefined) {
      throw new ToBeUndefinedAssertionError(actual);
    }
  },
  formatError(error: ToBeUndefinedAssertionError) {
    return `expected ${this.formatValue(error.actual)} to be undefined`;
  },
});
