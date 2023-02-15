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
    const formatter = this.formatter.expected(error.meta.element).not.append('to be visible');

    if (!this.not && error.meta) {
      const key = error.hint as keyof typeof error.actual;
      const value = error.actual?.[key];

      formatter.append(`but it has style "${key}: ${value}"`);
    }

    return formatter.result();
  },
});
