import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      toBeDefined(): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeDefined',

  assert(actual) {
    assertion(actual !== undefined);
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to be defined`;

    return message;
  },
});
