import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      toBeUndefined(): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeUndefined',

  prepare(actual) {
    return {
      actual,
      expected: undefined,
    };
  },

  assert(actual, expected) {
    assertion(Object.is(actual, expected));
  },

  getMessage(error) {
    return this.formatter.expected(error.actual).not.append('to be undefined').result();
  },
});
