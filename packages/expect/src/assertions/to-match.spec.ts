import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toMatch', () => {
  it('string matching a regexp', () => {
    expect('test').toMatch(/t.st/);
  });

  it('string not matching a regexp', () => {
    testError(() => expect('chaton').toMatch(/t.st/), {
      message: 'expected "chaton" to match /t.st/',
      actual: 'chaton',
      meta: { regexp: /t.st/ },
    });
  });

  it('not.toMatch()', () => {
    expect('chaton').not.toMatch(/t.st/);
    testError(() => expect('test').not.toMatch(/t.st/), 'expected "test" not to match /t.st/');
  });

  it('documentation examples', () => {
    expect('foo').toMatch(/^f/);
    testError(() => expect('bar').toMatch(/^f/));
  });
});
