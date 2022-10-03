import assert from 'assert';
import { castAsMatcher, createMatcher, isMatcher } from './create-matcher';

describe('createMatcher', () => {
  it('creates a matcher function', () => {
    const matcher = createMatcher(() => true);

    const match = matcher();

    assert.ok(isMatcher(match));
  });

  it('invokes a matcher function', () => {
    const equals = createMatcher((value: string, other: string) => {
      return value === other;
    });

    const equalsTest = castAsMatcher(equals('test'));

    assert.ok(equalsTest('test'));
    assert.ok(!equalsTest('chaton'));
  });
});
