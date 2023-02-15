import expect, { assertion } from '@nilscox/expect';
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
    return this.formatter
      .expected(error.subject)
      .not.append('to have been called')
      .if(this.not, {
        then: `\ncalls:\n${error.meta.calls
          .map(({ args }) => args.map((arg) => this.formatValue(arg)).join(', '))
          .join('\n')}`,
      })
      .result();
  },
});
