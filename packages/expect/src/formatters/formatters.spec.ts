import assert from 'assert';

import { stringMatching } from '../matchers/string-matching';
import { createMatcher } from '../helpers/create-matcher';
import { removeStyles } from '../helpers/styles';
import { expect } from '../expect';

describe('formatters', () => {
  const format = (value: unknown) => {
    return removeStyles(expect.format(value));
  };

  it('formats a number', () => {
    assert.equal(format(42), '42');
    assert.equal(format(NaN), 'NaN');
    assert.equal(format(Infinity), 'Infinity');
  });

  it('formats a boolean', () => {
    assert.equal(format(true), 'true');
    assert.equal(format(false), 'false');
  });

  it('formats a string', () => {
    assert.equal(format('toto'), '"toto"');
  });

  it('formats an object', () => {
    assert.equal(format({ foo: 'bar' }), "{ foo: 'bar' }");
  });

  it('formats an array', () => {
    assert.equal(format([]), '[]');
    assert.equal(format([1]), '[1]');
    assert.equal(format([1, '2']), '[1, "2"]');
  });

  it('formats a function', () => {
    assert.equal(
      format(function toto() {}),
      '[function toto]'
    );
  });

  it('formats an anonymous function', () => {
    assert.equal(
      format(() => {}),
      '[anonymous function]'
    );
  });

  it('formats an error', () => {
    assert.equal(format(new Error('message')), '[Error: message]');

    class CustomError extends Error {}
    assert.equal(format(new CustomError('message')), '[CustomError: message]');
  });

  it('formats a matcher', () => {
    assert.equal(format(stringMatching(/t.st/)), 'a string matching /t.st/');
  });

  it('formats a matcher without formatting function', () => {
    const matcher = createMatcher((value) => value === true);
    assert.equal(format(matcher()), '(value) => value === true');
  });

  it('formats an object containing a matcher', () => {
    const matcher = stringMatching(/t.st/);
    assert.equal(format({ foo: { bar: matcher } }), '{ foo: { bar: a string matching /t.st/ } }');
  });
});
