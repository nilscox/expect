import { AssertionDefinition, AssertionDefinitions, AssertionNames } from './expect-types';

declare global {
  namespace Expect {
    interface ExpectFunction {
      _assertions: AssertionDefinitions;

      _customAssertions: Set<AssertionNames>;

      addAssertion<Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>): void;

      addCustomAssertion<Name extends AssertionNames, Actual>(
        assertion: AssertionDefinition<Name, Actual>
      ): void;
    }
  }
}

export const addAssertion = function <Name extends AssertionNames, Actual>(
  this: Expect.ExpectFunction,
  assertion: AssertionDefinition<Name, Actual>
) {
  if (assertion.name in this._assertions) {
    throw new Error(`cannot add assertion "${assertion.name}" because it already exits`);
  }

  this._assertions[assertion.name] = assertion as AssertionDefinitions[Name];
};

export const addCustomAssertion = function <Name extends AssertionNames, Actual>(
  this: Expect.ExpectFunction,
  assertion: AssertionDefinition<Name, Actual>
) {
  this.addAssertion(assertion);
  this._customAssertions.add(assertion.name);
};

export const cleanupAssertion = function (this: Expect.ExpectFunction) {
  for (const assertion of Object.values(this._assertions)) {
    if (!this._customAssertions.has(assertion.name)) {
      continue;
    }

    delete this._assertions[assertion.name];
  }

  this._customAssertions.clear();
};
