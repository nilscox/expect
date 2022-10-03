import assert from 'assert';
import { castAsMatcher } from '../helpers/create-matcher';
import { any } from './any';
import { objectWith } from './object-with';
import { stringMatching } from './string-matching';

describe('objectWith', () => {
  it('matches an object containing a set of properties', () => {
    const isMatching = castAsMatcher(objectWith({ id: 1 }));

    assert.ok(isMatching({ id: 1 }));

    assert.ok(!isMatching({ id: 2 }));
    // @ts-expect-error
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

    // @ts-expect-error
    assert.ok(!isMatching({ id: 1 }));
    assert.ok(!isMatching({ id: 1, name: 'yo hey' }));
  });
});
