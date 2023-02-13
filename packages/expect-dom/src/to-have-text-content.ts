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
    assertion(this.deepEqual(actual, expected));
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.meta.element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to have text';
    message += ` ${this.formatValue(error.expected)}`;

    if (this.not) {
      message += ' but it does';
    } else if (error.actual) {
      message += ` but it is ${this.formatValue(error.actual)}`;
    }

    return message;
  },
});
