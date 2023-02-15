import expect, { assertion } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface HTMLElementAssertions<Actual> {
      toBeDisabled(): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeDisabled',

  expectedType: 'an instance of HTMLButtonElement',
  guard(actual): actual is HTMLButtonElement {
    return actual instanceof HTMLButtonElement;
  },

  prepare(element) {
    return {
      actual: element.disabled,
      expected: true,
      meta: { element },
    };
  },

  assert(actual, expected) {
    assertion(actual === expected);
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.meta.element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to be disabled';

    return message;
  },
});
