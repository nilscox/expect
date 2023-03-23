import { expect } from '../expect';
import { testError } from '../helpers/test-error';

describe('toBeUndefined', () => {
  it('undefined value', () => {
    expect(undefined).toBeUndefined();
  });

  it('not undefined value', () => {
    testError(() => expect(1).toBeUndefined(), {
      message: 'expected 1 to be undefined',
      expected: undefined,
      actual: 1,
    });
  });

  it('not.toBeUndefined()', () => {
    expect({}).not.toBeUndefined();
    testError(() => expect(undefined).not.toBeUndefined(), 'expected undefined not to be undefined');
  });

  it.skip('documentation examples', () => {});
});
