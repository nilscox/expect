import { expect } from '../expect';
import { testError } from '../test/test-error';
import { ToEqualAssertionError } from './to-equal';

describe('toEqual', () => {
  it('same primitive type', () => {
    expect(1).toEqual(1);
  });

  it('different primitive types', () => {
    testError(() => expect<number>(1).toEqual(2), new ToEqualAssertionError(1, 2), 'expected 1 to equal 2');
  });

  it('same object reference', () => {
    const obj = {};
    expect(obj).toEqual(obj);
  });

  it('different object references but matching objects', () => {
    expect({}).toEqual({});
    expect({ a: 1, b: ['foo'] }).toEqual({ a: 1, b: ['foo'] });
  });

  it('different object references and non-matching objects', () => {
    testError(
      () => expect({}).toEqual({ a: 1 }),
      new ToEqualAssertionError({}, { a: 1 }),
      'expected [object Object] to equal [object Object]'
    );

    testError(
      () => expect<{}>({ a: 1 }).toEqual({}),
      new ToEqualAssertionError({ a: 1 }, {}),
      'expected [object Object] to equal [object Object]'
    );
  });
});
