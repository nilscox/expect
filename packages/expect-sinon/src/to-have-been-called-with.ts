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

  prepare(spy, ...args) {
    return {
      actual: spy.getCalls(),
      meta: {
        args,
      },
    };
  },

  assert(calls, expected, { args }) {
    callsLoop: for (const call of calls) {
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

  getMessage(error) {
    return this.formatter
      .expected(error.subject)
      .not.append('to have been called')
      .if(error.meta.args.length > 0, {
        then: `with ${error.meta.args.map((arg) => this.formatValue(arg)).join(', ')}`,
        else: 'without argument',
      })
      .result();
  },
});
