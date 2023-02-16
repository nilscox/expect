import assert from 'assert';

import { stringMatching } from '../matchers/string-matching';
import { createMatcher } from './create-matcher';
import { formatValue } from './format-value';
import { removeStyles } from './styles';

describe('formatValue', () => {
  it('formats a number', () => {
    assert.equal(formatValue(42), '42');
    assert.equal(formatValue(NaN), 'NaN');
    assert.equal(formatValue(Infinity), 'Infinity');
  });

  it('formats a boolean', () => {
    assert.equal(formatValue(true), 'true');
    assert.equal(formatValue(false), 'false');
  });

  it('formats a string', () => {
    assert.equal(formatValue('toto'), '"toto"');
  });

  it('formats an object', () => {
    assert.equal(removeStyles(formatValue({ foo: 'bar' })), "{ foo: 'bar' }");
  });

  it('formats an array', () => {
    assert.equal(formatValue([]), '[]');
    assert.equal(formatValue([1]), '[1]');
    assert.equal(formatValue([1, '2']), '[1, "2"]');
  });

  it('formats a function', () => {
    assert.equal(
      formatValue(function toto() {}),
      '[function toto]'
    );
  });

  it('formats an anonymous function', () => {
    assert.equal(
      formatValue(() => {}),
      '[anonymous function]'
    );
  });

  it('formats an error', () => {
    assert.equal(formatValue(new Error('message')), '[Error: message]');

    class CustomError extends Error {}
    assert.equal(formatValue(new CustomError('message')), '[CustomError: message]');
  });

  it('formats a matcher', () => {
    assert.equal(formatValue(stringMatching(/t.st/)), 'a string matching /t.st/');
  });

  it('formats a matcher without formatting function', () => {
    const matcher = createMatcher((value) => value === true);
    assert.equal(formatValue(matcher()), '(value) => value === true');
  });

  it('formats an object containing a matcher', () => {
    const matcher = stringMatching(/t.st/);
    assert.equal(formatValue({ foo: { bar: matcher } }), '{ foo: { bar: a string matching /t.st/ } }');
  });
});
