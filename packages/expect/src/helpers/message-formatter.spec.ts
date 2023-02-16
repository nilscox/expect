import assert from 'assert';
import { messageFormatter, MessageFormatter } from './message-formatter';
import { removeStyles } from './styles';

describe('formatMessage', () => {
  let formatter: MessageFormatter;

  beforeEach(() => {
    formatter = messageFormatter({ not: false, maxInlineLength: 60 });
  });

  it('empty value', () => {
    const message = formatter.result();

    assert.equal(removeStyles(message), '');
  });

  it('simple message', () => {
    const message = formatter.append('message').result();

    assert.equal(removeStyles(message), 'message');
  });

  it('start with expected', () => {
    const message = formatter.expected(42).result();

    assert.equal(removeStyles(message), 'expected 42');
  });

  it('formats a message splitted into in multiple chunks', () => {
    const message = formatter.append('one').append('two').append('three').result();

    assert.equal(removeStyles(message), 'one two three');
  });

  it('appends a chunk conditionally', () => {
    const message = formatter.if(true, { then: 'yes' }).result();

    assert.equal(removeStyles(message), 'yes');
  });

  it('appends a chunk conditionally (else)', () => {
    const message = formatter.if(false, { then: 'yes', else: 'no' }).result();

    assert.equal(removeStyles(message), 'no');
  });

  it('appends a chunk conditionally using a type guard', () => {
    const isNumber = (value: unknown): value is number => typeof value === 'number';
    const message = formatter.if(isNumber, 42 as unknown, { then: (value) => String(value + 1) }).result();

    assert.equal(removeStyles(message), '43');
  });

  it('non-inverted message', () => {
    const message = formatter.append('42 is').not.append('defined').result();

    assert.equal(removeStyles(message), '42 is defined');
  });

  it('inverted message', () => {
    formatter = messageFormatter({ not: true, maxInlineLength: 60 });

    const message = formatter.append('undefined is').not.append('defined').result();

    assert.equal(removeStyles(message), 'undefined is not defined');
  });

  it('value formatting', () => {
    const message = formatter.value({ foo: 'bar' }).result();

    assert.equal(removeStyles(message), "{ foo: 'bar' }");
  });

  it('long value formatting', () => {
    formatter = messageFormatter({ not: false, maxInlineLength: 1 });

    const value = { foo: 'bar' };
    const message = formatter.value(value).result();

    const expected = `#1

#1: {
  foo: 'bar'
}`;

    assert.equal(removeStyles(message), expected);
  });

  it('long value formatting with multiple references', () => {
    formatter = messageFormatter({ not: false, maxInlineLength: 1 });

    const message = formatter.value(12).value(34).result();

    const expected = `#1 #2

#1: 12

#2: 34`;

    assert.equal(removeStyles(message), expected);
  });

  it('full message formatting', () => {
    formatter = messageFormatter({ not: true, maxInlineLength: 20 });

    const value = {
      foo: { toto: ['tata', 'tutu'] },
      bar: { baz: 'baz' },
      magic: 42,
    };

    const message = formatter
      .expected(value)
      .not.append('to have property')
      .value('magic')
      .if(true, {
        then: 'but it does',
        else: 'never',
      })
      .result();

    const expected = `expected #1 not to have property "magic" but it does

#1: {
  foo: {
    toto: [
      'tata',
      'tutu'
    ]
  },
  bar: {
    baz: 'baz'
  },
  magic: 42
}`;

    assert.equal(removeStyles(message), expected);
  });
});
