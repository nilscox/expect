import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveLength(length: number): void;
    }
  }
}

type ObjectWithLength = { length: number };

export class ToHaveLengthAssertionError extends AssertionError<ObjectWithLength> {
  constructor(actual: ObjectWithLength, public readonly length: number) {
    super('toHaveLength', actual);
  }

  format(formatValue: ValueFormatter): string {
    let message = `expected ${formatValue(this.actual)}`;

    if (typeof this.actual === 'function') {
      message += ` to take ${formatValue(this.length)} argument(s)`;
    } else {
      message += ` to have length ${formatValue(this.length)}`;
    }

    return message;
  }
}

expect.addAssertion({
  name: 'toHaveLength',
  expectedType: '{ length: number }',
  guard(actual: unknown): actual is ObjectWithLength {
    if (actual == null) {
      return false;
    }

    if (!Object.getOwnPropertyNames(actual).includes('length')) {
      return false;
    }

    return typeof (actual as Record<string, unknown>)['length'] === 'number';
  },
  assert(actual, length) {
    if (actual.length !== length) {
      throw new ToHaveLengthAssertionError(actual, length);
    }
  },
});
