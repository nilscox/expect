import expect, { AssertionFailed } from '@nilscox/expect';
import sinon from 'sinon';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveBeenCalledWith(...args: any[]): void;
    }
  }
}

expect.addAssertion({
  name: 'toHaveBeenCalledWith',
  expectedType: 'a sinon.spy()',
  guard(actual): actual is sinon.SinonSpy {
    return actual != null && 'called' in actual;
  },
  assert(actual, ...args) {
    if (!actual.calledWith(...args)) {
      throw new AssertionFailed();
    }
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
