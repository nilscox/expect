import { expect } from '../expect';
import { testError } from '../test/test-error';
import { ToMatchAssertionError } from './to-match';

describe('toMatch', () => {
  it('string matching a regexp', () => {
    expect('test').toMatch(/t.st/);
  });

  it('string not matching a regexp', () => {
    testError(
      () => expect('chaton').toMatch(/t.st/),
      new ToMatchAssertionError('chaton', /t.st/),
      'expected "chaton" to match /t.st/'
    );
  });
});
