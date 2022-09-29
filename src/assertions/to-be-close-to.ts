import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { isNumber } from "../errors/guard-error";

declare global {
  namespace Expect {
    interface NumberAssertions {
      toBeCloseTo(value: number, options?: { threshold?: number; strict?: boolean }): void;
    }
  }
}

export class ToBeCloseToAssertionError extends AssertionError<number> {
  constructor(actual: number, public readonly value: number, public readonly strict: boolean) {
    super("toBeCloseTo", actual);
  }
}

expect.addAssertion({
  name: "toBeCloseTo",
  guard: isNumber("toBeCloseTo"),
  execute(actual: number, value: number, { threshold = 0.001, strict = true } = {}) {
    const delta = Math.abs(actual - value);

    if (delta > threshold || (strict && delta == threshold)) {
      throw new ToBeCloseToAssertionError(actual, value, strict);
    }
  },
  formatError(error: ToBeCloseToAssertionError) {
    return `expected ${error.actual} to be close to ${error.value}`;
  },
});
