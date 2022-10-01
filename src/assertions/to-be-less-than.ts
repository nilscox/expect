import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isNumber } from "../errors/guard-error";
import { ValueFormatter } from "../helpers/format-value";

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

  format(formatValue: ValueFormatter): string {
    if (!this.strict) {
      return `expected ${formatValue(this.actual)} to be less or equal to ${formatValue(this.value)}`;
    }

    return `expected ${formatValue(this.actual)} to be less than ${formatValue(this.value)}`;
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
});
