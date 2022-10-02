import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeDefined(): void;
    }
  }
}

class ToBeDefinedAssertionError extends AssertionError {
  constructor(actual: unknown) {
    super('toBeDefined', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to be defined`;
  }
}

expect.addAssertion({
  name: 'toBeDefined',
  assert(actual) {
    if (actual === null || actual === undefined) {
      throw new ToBeDefinedAssertionError(actual);
    }
  },
});
