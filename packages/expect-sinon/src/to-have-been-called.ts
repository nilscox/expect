import expect, { assertion, AssertionFailed } from '@nilscox/expect';
import { isSpy } from './is-spy';

declare global {
  namespace Expect {
    export interface SinonSpyAssertions<Actual> {
      toHaveBeenCalled(): void;
    }
  }
}

expect.addAssertion({
  name: 'toHaveBeenCalled',

  expectedType: 'a sinon.spy()',
  guard: isSpy,

  prepare(spy) {
    return {
      actual: spy.called,
      meta: {
        calls: spy.getCalls(),
      },
    };
  },

  assert(called) {
    assertion(called);
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.subject)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have been called`;

    if (this.not) {
      message += ' but it was\n';
      message += 'calls:\n';

      message += error.meta.calls.map(({ args }) => args.map(this.formatValue).join(', ')).join('\n');
    }

    return message;
  },
});
