import assert from 'assert';
import { expect } from '../expect';
import { castAsMatcher } from '../helpers/create-matcher';
import { anything } from './anything';

describe('anything', () => {
  const isAnything = castAsMatcher(anything());

  it('matches any given value', () => {
    assert.ok(isAnything(undefined));
    assert.ok(isAnything(42));
    assert.ok(isAnything({}));
    assert.ok(isAnything(() => {}));
  });

  it('documentation examples', () => {
    expect('getSomething()').toEqual(expect.anything());
    expect({ foo: 'bar', value: 42 }).toEqual({ foo: expect.anything(), value: 42 });
  });
});
