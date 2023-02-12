import { AssertionFailed } from '../errors/assertion-failed';
import { isArray, isString } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface StringAssertions<Actual> {
      toInclude(substring: Actual[number]): void;
    }

    export interface ArrayAssertions<Actual> {
      toInclude(element: Actual[number]): void;
    }
  }
}

expect.addAssertion({
  name: 'toInclude',
  guard(actual): actual is Array<unknown> | string {
    return isArray(actual) || isString(actual);
  },
  assert(actual, element) {
    if (typeof actual === 'string' && typeof element === 'string') {
      return actual.includes(element);
    }

    for (const value of actual) {
      if (this.deepEqual(value, element)) {
        return;
      }
    }

    throw new AssertionFailed({ meta: { element } });
  },
  getMessage(actual, element) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to include ${element}`;

    return message;
  },
});
