import assert from 'assert';
import { formatValue } from './format-value';

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
    assert.equal(formatValue({ foo: 'bar' }), '{"foo":"bar"}');
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
});
