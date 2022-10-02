import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toBeUndefined', () => {
  it('undefined value', () => {
    expect(undefined).toBeUndefined();
  });

  it('defined value', () => {
    testError(() => expect(1).toBeUndefined(), 'expected 1 to be undefined');
  });

  it('not.toBeUndefined()', () => {
    expect(1).not.toBeUndefined();
    testError(() => expect(undefined).not.toBeUndefined(), 'expected undefined not to be undefined');
  });
});
