import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/src/test/test-error';

import './to-have-value';

describe('toHaveValue', () => {
  it('input element without value', () => {
    const input = document.createElement('input');

    expect(input).toHaveValue('');
  });

  it('input element without value but expected', () => {
    const input = document.createElement('input');

    testError(() => expect(input).toHaveValue('world'), {
      message: 'expected [object HTMLInputElement] to have value = "world"',
      actual: '',
      expected: 'world',
      meta: {
        element: input,
      },
    });
  });

  it('input element with expected value', () => {
    const input = document.createElement('input');

    input.value = 'hello';

    expect(input).toHaveValue('hello');
  });

  it('textarea element with expected value', () => {
    const textarea = document.createElement('textarea');

    textarea.value = 'hello';

    expect(textarea).toHaveValue('hello');
  });

  it('input element without expected value', () => {
    const input = document.createElement('input');

    input.value = 'hello';

    testError(() => expect(input).toHaveValue('world'), {
      message: 'expected [object HTMLInputElement] to have value = "world" but it is "hello"',
      actual: 'hello',
      expected: 'world',
      meta: {
        element: input,
      },
    });
  });

  it('not.toHaveValue', () => {
    const input = document.createElement('input');

    input.value = 'hello';

    expect(input).not.toHaveValue('world');

    testError(
      () => expect(input).not.toHaveValue('hello'),
      'expected [object HTMLInputElement] not to have value = "hello" but it does'
    );
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toHaveValue;
  });
});
