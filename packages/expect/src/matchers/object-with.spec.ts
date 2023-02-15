import assert from 'assert';
import util from 'util';
import { expect } from '../expect';
import { castAsMatcher } from '../helpers/create-matcher';
import { testError } from '../test/test-error';
import { any } from './any';
import { objectWith } from './object-with';
import { stringMatching } from './string-matching';

describe('objectWith', () => {
  it('matches an object containing a set of properties', () => {
    const isMatching = castAsMatcher(objectWith({ id: 1 }));

    assert.ok(isMatching({ id: 1, foo: 'bar' }));
    assert.ok(isMatching({ id: 1 }));

    assert.ok(!isMatching({ id: 2 }));
    assert.ok(!isMatching([1]));
  });

  it('combine objectWith and other matchers', () => {
    const isMatching = castAsMatcher(
      objectWith({
        id: any(Number),
        name: stringMatching(/^hey/),
      })
    );

    assert.ok(isMatching({ id: 4, name: 'hey yo' }));
    assert.ok(isMatching({ id: 2, name: 'hey ga' }));

    assert.ok(!isMatching({ id: 1 }));
    assert.ok(!isMatching({ id: 1, name: 'yo hey' }));
  });

  it('formats an objectWith matcher', () => {
    const isMatching = objectWith({
      id: 4,
    });

    assert.equal(util.inspect(isMatching), 'an object with { id: 4 }');
  });

  it('formats combined matchers', () => {
    const objectWithId = objectWith({
      id: any(Number),
    });

    assert.equal(util.inspect(objectWithId), 'an object with { id: any number }');
  });

  it('documentation examples', () => {
    expect({ foo: 'bar', baz: 'qux' }).toEqual(expect.objectWith({ foo: 'bar' }));
    testError(() => expect({ foo: 'bar' }).toEqual(expect.objectWith({ foo: 'bar', baz: 'qux' })));
  });
});
