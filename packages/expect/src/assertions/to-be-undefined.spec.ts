import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toBeUndefined', () => {
  it('undefined value', () => {
    expect(undefined).toBeUndefined();
  });

  it('defined value', () => {
    testError(() => expect(1).toBeUndefined(), {
      message: 'expected 1 to be undefined',
      actual: 1,
      expected: undefined,
    });
  });

  it('not.toBeUndefined()', () => {
    expect(1).not.toBeUndefined();
    testError(() => expect(undefined).not.toBeUndefined(), 'expected undefined not to be undefined');
  });
});
