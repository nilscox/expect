import expect, { assertion } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface HTMLElementAssertions<Actual> {
      toHaveValue(value: string): void;
    }
  }
}

type InputType = HTMLInputElement | HTMLTextAreaElement;

expect.addAssertion({
  name: 'toHaveValue',

  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is InputType {
    return actual instanceof HTMLInputElement || actual instanceof HTMLTextAreaElement;
  },

  prepare(element, expected) {
    return {
      actual: element.value,
      expected,
      meta: { element },
    };
  },

  assert(value, expected) {
    if (value === null) {
      assertion(expected === '');
      return;
    }

    assertion(this.deepEqual(value, expected));
  },

  getMessage(error) {
    return this.formatter
      .expected(error.meta.element)
      .not.append('to have value =')
      .value(error.expected)
      .if(!this.not && Boolean(error.actual), {
        then: `but it is ${this.formatValue(error.actual)}`,
      })
      .result();
  },
});
