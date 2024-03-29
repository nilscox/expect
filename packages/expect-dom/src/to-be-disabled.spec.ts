import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/helpers/test-error';

describe('toBeDisabled', () => {
  const createButton = (disabled = false) => {
    const button = document.createElement('button');

    button.disabled = disabled;

    return button;
  };

  it('disabled button', () => {
    expect(createButton(true)).toBeDisabled();
  });

  it('not disabled button', () => {
    const button = createButton();

    testError(() => expect(button).toBeDisabled(), {
      message: 'expected HTMLButtonElement {} to be disabled',
      actual: false,
      expected: true,
      meta: { element: button },
    });
  });

  it('not.toBeDisabled', () => {
    expect(createButton()).not.toBeDisabled();

    testError(
      () => expect(createButton(true)).not.toBeDisabled(),
      'expected HTMLButtonElement {} not to be disabled'
    );
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toBeDisabled;
  });
});
