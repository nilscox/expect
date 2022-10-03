import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toInclude', () => {
  it('array including the value', () => {
    expect([1, 2]).toInclude(1);
    expect([1, 2]).toInclude(2);
  });

  it('array not including the value', () => {
    testError(() => expect([1, 2]).toInclude(3), 'expected 1,2 to include 3');
  });

  it('not.toInclude()', () => {
    expect([1]).not.toInclude(2);
    testError(() => expect([1]).not.toInclude(1), 'expected 1 not to include 1');
  });
});
