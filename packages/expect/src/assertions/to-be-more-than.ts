import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { isNumber } from '../errors/guard-error';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    interface Assertions {
      toBeMoreThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

export class ToBeMoreThanAssertionError extends AssertionError<number> {
  constructor(actual: number, public readonly value: number, public readonly strict: boolean) {
    super('toBeMoreThan', actual);
  }

  format(formatValue: ValueFormatter): string {
    if (!this.strict) {
      return `expected ${formatValue(this.actual)} to be more or equal to ${formatValue(this.value)}`;
    }

    return `expected ${formatValue(this.actual)} to be more than ${formatValue(this.value)}`;
  }
}

expect.addAssertion({
  name: 'toBeMoreThan',
  expectedType: 'number',
  guard: isNumber,
  assert(actual: number, value, { strict = true } = {}) {
    if (actual < value || (strict && actual == value)) {
      throw new ToBeMoreThanAssertionError(actual, value, strict);
    }
  },
});
