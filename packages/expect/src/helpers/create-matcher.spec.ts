import util from 'util';
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

  it('prints a matcher using util.inspect', () => {
    const matchSomething = createMatcher(() => true);

    assert.equal(util.inspect(matchSomething()), '() => true');
  });

  it('prints a matcher with a custom serializer', () => {
    const matchSomething = createMatcher(
      () => true,
      () => 'serialized'
    );

    assert.equal(util.inspect(matchSomething()), 'serialized');
  });

  it('prints a matcher with a custom serializer and arguments', () => {
    const matchSomething = createMatcher(
      (value: unknown, arg: boolean) => true,
      (arg) => `serialized ${arg}`
    );

    assert.equal(util.inspect(matchSomething(true)), 'serialized true');
  });
});
