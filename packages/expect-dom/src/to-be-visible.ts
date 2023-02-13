import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface HTMLElementAssertions<Actual> {
      toBeVisible(): void;
    }
  }
}

type Meta = {
  element: HTMLElement;
  key: 'display' | 'visibility' | 'opacity';
  value: string;
};

expect.addAssertion({
  name: 'toBeVisible',
  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },
  assert(element) {
    const { display, visibility, opacity } = window.getComputedStyle(element);

    if (display === 'none') {
      throw new AssertionFailed<Meta>({ meta: { element, key: 'display', value: 'none' } });
    }

    if (visibility === 'hidden' || visibility === 'collapse') {
      throw new AssertionFailed<Meta>({ meta: { element, key: 'visibility', value: visibility } });
    }

    if (opacity === '0') {
      throw new AssertionFailed<Meta>({ meta: { element, key: 'opacity', value: '0' } });
    }
  },
  getMessage(element) {
    let meta = this.error?.meta as { key: string; value: string } | undefined;
    let message = `expected ${this.formatValue(element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to be visible';

    if (this.not) {
      message += ' but it is';
    }

    if (meta) {
      message += ` but it has style "${meta.key}: ${meta.value}"`;
    }

    return message;
  },
});
