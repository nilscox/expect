import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { deepEqual } from '../helpers/deep-equal';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toEqual(expected: Actual): void;
    }
  }
}

export class ToEqualAssertionError<T> extends AssertionError<T> {
  constructor(actual: T, public readonly expected: T) {
    super('toEqual', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to equal ${formatValue(this.expected)}`;
  }
}

expect.addAssertion({
  name: 'toEqual',
  assert(actual, expected) {
    if (!deepEqual(actual, expected)) {
      throw new ToEqualAssertionError(actual, expected);
    }
  },
});
