import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';

type Constructor<T> = { new (...args: any[]): T };

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      toBeInstanceOf<T extends Actual, ClassType extends Constructor<T>>(Class: ClassType): T;
    }
  }
}

const isClassType = (value: unknown): value is Constructor<unknown> => {
  return typeof value === 'object' && value != null && 'constructor' in value;
};

expect.addAssertion({
  name: 'toBeInstanceOf',

  expectedType: 'a class',
  guard: isClassType,

  prepare(subject, Class: Constructor<unknown>) {
    return {
      actual: subject.constructor,
      expected: Class,
      meta: {
        subject,
        className: Class.name,
      },
    };
  },

  assert(ctor, Class, { subject }) {
    assertion(subject instanceof Class);
    return subject;
  },

  getMessage(error) {
    return this.formatter
      .expected(error.subject)
      .not.append(`to be an instance of ${error.meta.className}`)
      .result();
  },
});
