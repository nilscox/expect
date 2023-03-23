import assert from 'assert';
import { expect } from '../expect';
import { testError } from '../helpers/test-error';

describe('toBeInstanceOf', () => {
  class MyClass {}

  it('instance of a class', () => {
    expect(new MyClass()).toBeInstanceOf(MyClass);
  });

  it('returns the instance', () => {
    const instance = new MyClass();

    const result = expect(instance).toBeInstanceOf(MyClass);
    assert(Object.is(instance, result));
  });

  it('instance of a subclass', () => {
    class SubClass extends MyClass {}

    expect(new SubClass()).toBeInstanceOf(SubClass);
    expect(new SubClass()).toBeInstanceOf(MyClass);
  });

  it('not an instance of a class', () => {
    testError(() => expect<unknown>({}).toBeInstanceOf(MyClass), {
      message: 'expected {} to be an instance of MyClass',
      expected: MyClass,
      actual: Object,
    });
  });
});
