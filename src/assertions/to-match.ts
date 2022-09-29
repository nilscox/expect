import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isString } from "../errors/guard-error";

declare global {
  namespace Expect {
    interface StringAssertions {
      toMatch(expected: RegExp): void;
    }
  }
}

export class ToMatchAssertionError extends AssertionError<string> {
  constructor(actual: string, public readonly regexp: RegExp) {
    super("toMatch", actual);
  }
}

expect.addAssertion({
  name: "toMatch",
  guard: isString("toMatch"),
  execute(actual: string, regexp: RegExp) {
    if (!regexp.exec(actual)) {
      throw new ToMatchAssertionError(actual, regexp);
    }
  },
  formatError(error: ToMatchAssertionError) {
    return `expected ${this.formatValue(error.actual)} to match ${error.regexp}`;
  },
});
