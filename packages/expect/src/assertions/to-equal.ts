import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      toEqual(expected: Actual): void;
    }
  }
}

expect.addAssertion({
  name: 'toEqual',

  prepare(actual, expected) {
    return { actual, expected };
  },

  assert(actual, expected) {
    assertion(this.compare(actual, expected));
  },

  getMessage(error) {
    return this.formatter.expected(error.actual).not.append('to equal').value(error.expected).result();
  },
});
