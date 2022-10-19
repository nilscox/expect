import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toHaveProperty', () => {
  it('object having the property', () => {
    expect({ foo: 1 }).toHaveProperty('foo');
  });

  it('object not having the property', () => {
    testError(() => expect({ foo: 1 }).toHaveProperty('bar'), {
      message: 'expected {"foo":1} to have property "bar"',
      actual: { foo: 1 },
    });
  });

  it('object having the property with a given value', () => {
    expect({ foo: 1 }).toHaveProperty('foo', 1);
  });

  it('object having the property with a given undefined value', () => {
    expect({ foo: undefined }).toHaveProperty('foo', undefined);
  });

  it('object having the property with a matching object', () => {
    expect({ foo: {} }).toHaveProperty('foo', {});
  });

  it('object having the nested property', () => {
    expect({ foo: { bar: 1 } }).toHaveProperty('foo.bar', 1);
    expect({ foo: { bar: 1 } }).toHaveProperty('foo.bar', expect.any(Number));
  });

  it('object having the property as a getter', () => {
    const object = new (class {
      get foo() {
        return 1;
      }
    })();

    expect(object).toHaveProperty('foo', 1);
  });

  it('object having the property but without the given value', () => {
    testError(() => expect({ foo: 1 }).toHaveProperty('foo', 2), {
      message: 'expected {"foo":1} to have property "foo" = 2',
      actual: 1,
      expected: 2,
    });
  });

  it('array having the length property to a given value', () => {
    expect([]).toHaveProperty('length', 0);
  });

  it('array having the length property with a different value', () => {
    testError(() => expect([]).toHaveProperty('length', 1), 'expected [] to have property "length" = 1');
  });

  it('not.notHaveProperty()', () => {
    expect({}).not.toHaveProperty('foo');
    testError(
      () => expect({ foo: 1 }).not.toHaveProperty('foo'),
      'expected {"foo":1} not to have property "foo"'
    );

    expect({ foo: 1 }).not.toHaveProperty('foo', 'bar');
    testError(
      () => expect({ foo: 1 }).not.toHaveProperty('foo', 1),
      'expected {"foo":1} not to have property "foo" = 1'
    );
  });

  it('documentation examples', () => {
    expect({ foo: 'bar' }).toHaveProperty('foo');
    testError(() => expect({}).toHaveProperty('foo'));
    testError(() => expect({ foo: 'not bar' }).toHaveProperty('foo', 'bar'));
    expect({ some: { nested: [{ value: 1 }, { value: 42 }] } }).toHaveProperty('some.nested.1.value', 42);
    expect({ foo: 'bar' }).toHaveProperty('foo', expect.stringMatching(/^b/));
  });
});
