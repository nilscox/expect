import util from 'util';
import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/helpers/test-error';

describe('toBeVisible', () => {
  const createStyledDiv = (styles: Partial<CSSStyleDeclaration>) => {
    const element = document.createElement('div');

    Object.assign(element.style, styles);

    return element;
  };

  it('visible element', () => {
    expect(createStyledDiv({})).toBeVisible();
  });

  const styles = {
    display: 'block',
    visibility: 'visible',
    opacity: '',
  };

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
        message: `expected #1 to be visible but it has style "${style}"\n\n#1: ${util.inspect(div)}`,
        hint: key,
        actual: { ...styles, [key]: value },
        meta: {
          element: div,
        },
      });
    });
  }

  it('not.toBeVisible()', () => {
    expect(createStyledDiv({ display: 'none' })).not.toBeVisible();

    testError(
      () => expect(createStyledDiv({})).not.toBeVisible(),
      `expected #1 not to be visible\n\n#1: ${util.inspect(createStyledDiv({}))}`
    );
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toBeVisible;
  });
});
