import assert from 'assert';
import { castAsMatcher } from '../helpers/create-matcher';
import { stringMatching } from './string-matching';

describe('stringMatching', () => {
  it('matches a string against a regexp', () => {
    const isMatching = castAsMatcher(stringMatching(/t.st$/));

    assert.ok(isMatching('test'));
    assert.ok(isMatching('tast'));
    assert.ok(!isMatching('taste'));
  });
});
