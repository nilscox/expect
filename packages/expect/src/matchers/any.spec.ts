import assert from 'assert';
import { expect } from '../expect';
import { castAsMatcher } from '../helpers/create-matcher';
import { testError } from '../test/test-error';
import { any } from './any';

describe('any', () => {
  it('matches a primitive type from its constructor', () => {
    const isString = castAsMatcher<unknown>(any(String));

    assert.ok(isString('hello'));
    assert.ok(!isString(42));
    assert.ok(!isString({}));
  });

  it('matches a class instance', () => {
    class Toto {}
    class Tata extends Toto {}

    const isToto = castAsMatcher<unknown>(any(Toto));

    assert.ok(isToto(new Toto()));
    assert.ok(isToto(new Tata()));

    assert.ok(!isToto('hello'));
    assert.ok(!isToto(Toto));
    assert.ok(!isToto(new Error()));
  });

  it('returns a correctly typed matcher', () => {
    const isNumber = castAsMatcher(any(Number));

    isNumber(42);

    try {
      // @ts-expect-error
      isNumber('hello');
    } catch {}

    const string: string = any(String);
    const number: number = any(Number);
    const bigint: bigint = any(BigInt);
    const boolean: Boolean = any(Boolean);
    const symbol: Symbol = any(Symbol);
    const date: Date = any(Date);
    const object: any = any(Object);
    const func: () => {} = any(Function);
  });

  it('formats an any matcher', () => {
    testError(
      () => expect<unknown>({ foo: 42 }).toEqual({ foo: any(String) }),
      'expected {"foo":42} to equal {"foo":"any String"}'
    );
  });

  it('documentation examples', () => {
    expect<number>(42).toEqual(expect.any(Number));
    testError(() => expect<any>({ foo: 'bar' }).toEqual({ foo: expect.any(Boolean) }));

    class Toto {}
    expect({ foo: new Toto() }).toEqual({ foo: expect.any(Toto) });
  });
});
