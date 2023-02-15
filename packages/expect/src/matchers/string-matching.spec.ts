import util from 'util';
import assert from 'assert';
import { expect } from '../expect';
import { castAsMatcher } from '../helpers/create-matcher';
import { testError } from '../test/test-error';
import { stringMatching } from './string-matching';

describe('stringMatching', () => {
  it('matches a string against a regexp', () => {
    const isMatching = castAsMatcher(stringMatching(/t.st$/));

    assert.ok(isMatching('test'));
    assert.ok(isMatching('tast'));
    assert.ok(!isMatching('taste'));
  });

  it('formats a stringMatcher matcher', () => {
    assert.equal(util.inspect(stringMatching(/t.st$/)), 'a string matching /t.st$/');
  });

  it('documentation examples', () => {
    expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/^b/) });
    testError(() => expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/foo/) }));
    testError(() => expect<any>({ foo: 'bar' }).toEqual(expect.stringMatching(/^b/)));
  });
});
