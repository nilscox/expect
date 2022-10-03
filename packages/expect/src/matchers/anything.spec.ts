import assert from 'assert';
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
});
