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
    return this.formatter.expected(error.actual).not.append('to be defined').result();
  },
});
