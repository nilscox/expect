import expect from '@nilscox/expect';
import { testError } from 'expect/src/test/test-error';

import './to-be-visible';

describe('toBeVisible', () => {
  const createStyledDiv = (styles: Partial<CSSStyleDeclaration>) => {
    const element = document.createElement('div');

    Object.assign(element.style, styles);

    return element;
  };

  it('visible element', () => {
    expect(createStyledDiv({})).toBeVisible();
  });

  for (const [key, value] of [
    ['display', 'none'],
    ['visibility', 'hidden'],
    ['visibility', 'collapse'],
    ['opacity', '0'],
  ]) {
    const style = `${key}: ${value}`;

    it(`element with style ${style}`, () => {
      const div = createStyledDiv({ [key]: value });

      testError(() => expect(div).toBeVisible(), {
        message: `expected [object HTMLDivElement] to be visible but it has style "${style}"`,
        actual: div,
        meta: {
          key,
          value,
        },
      });
    });
  }

  it('not.toBeVisible()', () => {
    expect(createStyledDiv({ display: 'none' })).not.toBeVisible();

    testError(
      () => expect(createStyledDiv({})).not.toBeVisible(),
      'expected [object HTMLDivElement] not to be visible but it is'
    );
  });
});
