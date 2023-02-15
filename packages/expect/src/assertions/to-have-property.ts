import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface ArrayAssertions<Actual> {
      toHaveProperty(property: string, value?: unknown): void;
    }

    export interface ObjectAssertions<Actual> {
      toHaveProperty(property: string, value?: unknown): void;
    }
  }
}

type NonNullObject = {};

expect.addAssertion({
  name: 'toHaveProperty',

  expectedType: 'non-null object',
  guard(actual): actual is NonNullObject {
    return actual !== null && actual !== undefined;
  },

  // property type is needed to correctly infer Meta type
  prepare(subject, property: string, expected) {
    const hasExpectedValue = arguments.length === 3;
    const path = property.split('.');
    const [lastProperty] = path.slice(-1);

    let parent: any = subject;

    for (const property of path.slice(0, -1)) {
      parent = parent[property];

      if (!parent) {
        continue;
      }
    }

    let actual: unknown;
    let hasProperty = Boolean(parent && lastProperty in parent);

    if (hasProperty) {
      actual = parent[lastProperty];
    }

    return {
      actual,
      expected,
      meta: {
        hasExpectedValue,
        hasProperty,
        property,
      },
    };
  },

  assert(actual, expected, { hasExpectedValue, hasProperty }) {
    assertion(hasProperty);

    if (hasExpectedValue) {
      assertion(this.deepEqual(actual, expected));
    }
  },

  getMessage(error) {
    return this.formatter
      .expected(error.subject)
      .not.append('to have property')
      .value(error.meta.property)
      .if(error.meta.hasExpectedValue, { then: `= ${this.formatValue(error.expected)}` })
      .result();
  },
});
