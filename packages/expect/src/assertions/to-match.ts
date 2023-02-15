import { assertion } from '../errors/assertion-failed';
import { isString } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface StringAssertions<Actual> {
      toMatch(expected: RegExp): void;
    }
  }
}

type Meta = {
  regexp: RegExp;
};

expect.addAssertion({
  name: 'toMatch',

  expectedType: 'a string',
  guard: isString,

  prepare(actual, regexp) {
    return {
      actual,
      meta: { regexp },
    };
  },

  assert(actual, expected, { regexp }) {
    assertion(regexp.exec(actual));
  },

  getMessage(error) {
    return this.formatter.expected(error.actual).not.append('to match').value(error.meta.regexp).result();
  },
});
