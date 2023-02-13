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
    let message = `expected ${this.formatValue(error.meta.element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have value`;
    message += ` = ${this.formatValue(error.expected)}`;

    if (this.not) {
      message += ' but it does';
    } else if (error.actual) {
      message += ` but it is ${this.formatValue(error.actual)}`;
    }

    return message;
  },
});
