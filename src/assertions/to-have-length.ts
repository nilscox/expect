import { AssertionError } from '../errors/assertion-error';
import { expect } from '../expect';
import { ValueFormatter } from '../helpers/format-value';

declare global {
  namespace Expect {
    interface Assertions {
      toHaveLength(length: number): void;
    }
  }
}

type ObjectWithLength = { length: number };

class ToHaveLengthAssertionError extends AssertionError<ObjectWithLength> {
  constructor(actual: ObjectWithLength, public readonly length: number) {
    super('toHaveLength', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to have length ${formatValue(this.length)}`;
  }
}

expect.addAssertion({
  name: 'toHaveLength',
  expectedType: '{ length: number }',
  guard(actual: unknown): actual is ObjectWithLength {
    if (actual == null) {
      return false;
    }

    // not working?
    // return "length" in actual && typeof actual["length"] === "number";
    return 'length' in actual && typeof (actual as Record<string, unknown>)['length'] === 'number';
  },
  assert(actual, length) {
    if (actual.length !== length) {
      throw new ToHaveLengthAssertionError(actual, length);
    }
  },
});
