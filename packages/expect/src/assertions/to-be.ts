import { error } from 'console';
import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toBe(expected: Actual): void;
    }
  }
}

export class ToBeAssertionError<T> extends AssertionError<T> {
  constructor(actual: T, public readonly expected: T) {
    super('toBe', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to be ${formatValue(this.expected)}`;
  }
}

expect.addAssertion({
  name: 'toBe',
  assert(actual, expected) {
    if (!Object.is(actual, expected)) {
      throw new ToBeAssertionError(actual, expected);
    }
  },
});
