import expect, { AssertionFailed } from '@nilscox/expect';
import { isSpy } from './is-spy';

declare global {
  namespace Expect {
    export interface SinonSpyAssertions<Actual> {
      toHaveBeenCalledWith(...args: any[]): void;
    }
  }
}

expect.addAssertion({
  name: 'toHaveBeenCalledWith',
  expectedType: 'a sinon.spy()',
  guard: isSpy,
  assert(actual, ...args) {
    callsLoop: for (const call of actual.getCalls()) {
      if (args.length !== call.args.length) {
        continue;
      }

      let idx = 0;

      for (const argOrMatcher of args) {
        if (!this.deepEqual(call.args[idx++], argOrMatcher)) {
          continue callsLoop;
        }
      }

      return;
    }

    throw new AssertionFailed();
  },
  getMessage(actual, ...args) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have been called `;

    if (args.length > 0) {
      message += `with ${args.map(this.formatValue).join(', ')}`;
    } else {
      message += `without argument`;
    }

    return message;
  },
});
