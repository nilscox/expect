import expect, { AssertionFailed } from '@nilscox/expect';
import sinon from 'sinon';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveBeenCalled(): void;
    }
  }
}

expect.addAssertion({
  name: 'toHaveBeenCalled',
  expectedType: 'a sinon.spy()',
  guard(actual): actual is sinon.SinonSpy {
    return actual != null && 'called' in actual;
  },
  assert(actual) {
    if (!actual.called) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have been called`;

    if (this.not) {
      message += ' but it was\n';
      message += 'calls:\n';

      message += actual
        .getCalls()
        .map(({ args }) => args.map(this.formatValue).join(', '))
        .join('\n');
    }

    return message;
  },
});
