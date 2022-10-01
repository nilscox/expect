import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";

declare global {
  namespace Expect {
    interface Assertions {
      toBeDefined(): void;
    }
  }
}

class ToBeDefinedAssertionError extends AssertionError {
  constructor(actual: unknown) {
    super("toBeDefined", actual);
  }
}

expect.addAssertion({
  name: "toBeDefined",
  assert(actual) {
    if (actual === null || actual === undefined) {
      throw new ToBeDefinedAssertionError(actual);
    }
  },
  formatError(error: ToBeDefinedAssertionError) {
    return `expected ${this.formatValue(error.actual)} to be defined`;
  },
});
