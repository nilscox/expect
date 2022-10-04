import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/src/test/test-error';

import './to-have-text-content';

describe('toHaveTextContent', () => {
  const createDiv = (text = '') => {
    const div = document.createElement('div');

    div.innerHTML = text;

    return div;
  };

  it('empty div', () => {
    expect(createDiv()).toHaveTextContent('');
  });

  it('div having some text', () => {
    expect(createDiv('hello')).toHaveTextContent('hello');
  });

  it('div having some text matching a matcher', () => {
    expect(createDiv('test')).toHaveTextContent(expect.stringMatching(/t.st/));
  });

  it('div not having the expected text', () => {
    testError(
      () => expect(createDiv('hello')).toHaveTextContent('world'),
      'expected [object HTMLDivElement] to have text "world" but it is "hello"'
    );
  });

  it('not.toHaveTextContent', () => {
    expect(createDiv('hello')).not.toHaveTextContent('world');

    testError(
      () => expect(createDiv('hello')).not.toHaveTextContent('hello'),
      'expected [object HTMLDivElement] not to have text "hello" but it does'
    );
  });
});
