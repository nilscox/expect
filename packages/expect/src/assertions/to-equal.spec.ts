import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toEqual', () => {
  it('same primitive type', () => {
    expect(1).toEqual(1);
  });

  it('different primitive types', () => {
    testError(() => expect<number>(1).toEqual(2), {
      message: 'expected 1 to equal 2',
      expected: 2,
      actual: 1,
    });
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
    testError(() => expect({}).toEqual({ a: 1 }), 'expected {} to equal { a: 1 }');
    testError(() => expect<{}>({ a: 1 }).toEqual({}), 'expected { a: 1 } to equal {}');
  });

  it('not.toEqual()', () => {
    expect<number>(42).not.toEqual(51);
    testError(() => expect(42).not.toEqual(42), 'expected 42 not to equal 42');
  });

  it('documentation examples', () => {
    expect(1).toEqual(1);
    expect({ foo: 'bar' }).toEqual({ foo: 'bar' });
    expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/^b/) });
    testError(() => expect({ foo: 'bar' }).toEqual({ foo: 'not bar' }));
  });
});
