import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    interface Assertions {
      toBeUndefined(): void;
    }
  }
}

class ToBeUndefinedAssertionError extends AssertionError {
  constructor(actual: unknown) {
    super('toBeUndefined', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to be undefined`;
  }
}

expect.addAssertion({
  name: 'toBeUndefined',
  assert(actual) {
    if (actual !== undefined) {
      throw new ToBeUndefinedAssertionError(actual);
    }
  },
});
