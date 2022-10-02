import assert from 'assert';
import { any, anything, deepEqual } from './deep-equal';

describe('deepEqual', () => {
  it('primitive values', () => {
    assert(deepEqual(1, 1));
    assert(deepEqual(true, true));

    // wtf javascript
    // assert(deepEqual(NaN, NaN));
  });

  it('same objects', () => {
    assert(deepEqual({}, {}));
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
    assert(deepEqual({ foo: 'bar' }, { foo: anything() }));
  });

  it('comparaison with any(Constructor)', () => {
    assert(deepEqual({ foo: 'bar' }, { foo: any(String) }));
    assert(deepEqual({ foo: new Error() }, { foo: any(Error) }));
  });

  it('comparaison with any(Constructor) inherited', () => {
    class Toto {}
    class Tata extends Toto {}

    assert(deepEqual({ foo: new Tata() }, { foo: any(Toto) }));
  });
});
