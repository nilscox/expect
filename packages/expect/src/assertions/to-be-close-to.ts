import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { isNumber } from '../errors/guard-error';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeCloseTo(value: number, options?: { threshold?: number; strict?: boolean }): void;
    }
  }
}

export class ToBeCloseToAssertionError extends AssertionError<number> {
  constructor(actual: number, public readonly value: number, public readonly strict: boolean) {
    super('toBeCloseTo', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to be close to ${formatValue(this.value)}`;
  }
}

expect.addAssertion({
  name: 'toBeCloseTo',
  expectedType: 'number',
  guard: isNumber,
  assert(actual, value, { threshold = 0.001, strict = true } = {}) {
    const delta = Math.abs(actual - value);

    if (delta > threshold || (strict && delta == threshold)) {
      throw new ToBeCloseToAssertionError(actual, value, strict);
    }
  },
});
