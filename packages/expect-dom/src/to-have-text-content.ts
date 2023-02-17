import expect, { assertion } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface HTMLElementAssertions<Actual> {
      toHaveTextContent(text: string): void;
    }
  }
}

expect.addAssertion({
  name: 'toHaveTextContent',

  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },

  prepare(element, expected) {
    return {
      actual: element.textContent,
      expected,
      meta: { element },
    };
  },

  assert(actual, expected) {
    assertion(this.compare(actual, expected));
  },

  getMessage(error) {
    return this.formatter
      .expected(error.meta.element)
      .not.append('to have text')
      .value(error.expected)
      .if(!this.not && Boolean(error.actual), {
        then: `but it is ${this.formatValue(error.actual)}`,
      })
      .result();
  },
});
