import expect, { assertion } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface HTMLElementAssertions<Actual> {
      toBeVisible(): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeVisible',

  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },

  prepare(element) {
    const { display, visibility, opacity } = window.getComputedStyle(element);

    return {
      actual: { display, visibility, opacity },
      meta: { element },
    };
  },

  assert({ display, visibility, opacity }) {
    assertion(display !== 'none', 'display');
    assertion(visibility !== 'hidden' && visibility !== 'collapse', 'visibility');
    assertion(opacity !== '0', 'opacity');
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.meta.element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to be visible';

    if (this.not) {
      message += ' but it is';
    } else if (error.meta) {
      const key = error.hint as keyof typeof error.actual;
      const value = error.actual?.[key];

      message += ` but it has style "${key}: ${value}"`;
    }

    return message;
  },
});
