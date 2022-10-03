import assert from 'assert';
import { any } from '../matchers/any';
import { anything } from '../matchers/anything';
import { deepEqual } from './deep-equal';

describe('deepEqual', () => {
  it('primitive values', () => {
    assert(deepEqual(undefined, undefined));
    assert(deepEqual(1, 1));
    assert(deepEqual(true, true));

    // wtf javascript
    // assert(deepEqual(NaN, NaN));
  });

  it('same objects', () => {
    assert(deepEqual({}, {}));
    assert(deepEqual({ foo: undefined }, {}));
    assert(deepEqual({ foo: 'bar' }, { foo: 'bar' }));
  });

  it('different objects', () => {
    assert(!deepEqual({}, { foo: 'bar' }));
    assert(!deepEqual({ foo: 'bar' }, {}));
  });

  it('different errors', () => {
    assert(!deepEqual(new Error('yes'), new Error('no')));
  });

  it('comparaison with anything()', () => {
    assert(deepEqual(1, anything()));
    assert(deepEqual({ foo: 'bar' }, { foo: anything() }));
  });

  it('comparaison with any(PrimitiveType)', () => {
    assert(deepEqual('', any(String)));
    assert(deepEqual(1, any(Number)));
    assert(deepEqual(BigInt('1'), any(BigInt)));
    assert(deepEqual(true, any(Boolean)));
    assert(deepEqual(Symbol(), any(Symbol)));
    assert(deepEqual({}, any(Object)));
    assert(deepEqual(() => {}, any(Function)));
  });

  class Toto {}
  class Tata extends Toto {}

  it('comparaison with expected any(Constructor)', () => {
    assert(deepEqual('bar', any(String)));
    assert(deepEqual({}, any(Object)));
    assert(deepEqual({ foo: 'bar' }, { foo: any(String) }));
    assert(deepEqual(new Toto(), any(Toto)));
    assert(deepEqual({ foo: new Toto() }, { foo: any(Toto) }));
    assert(deepEqual(new Tata(), any(Toto)));
  });

  it('comparaison with different any(Constructor)', () => {
    assert(!deepEqual(1, any(Toto)));
    assert(!deepEqual(new Toto(), any(Tata)));
  });
});
