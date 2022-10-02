import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { isString } from '../errors/guard-error';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    interface Assertions<Actual> {
      toMatch(expected: RegExp): void;
    }
  }
}

export class ToMatchAssertionError extends AssertionError<string> {
  constructor(actual: string, public readonly regexp: RegExp) {
    super('toMatch', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to match ${this.regexp}`;
  }
}

expect.addAssertion({
  name: 'toMatch',
  guard: isString,
  assert(actual, regexp) {
    if (!regexp.exec(actual)) {
      throw new ToMatchAssertionError(actual, regexp);
    }
  },
});
